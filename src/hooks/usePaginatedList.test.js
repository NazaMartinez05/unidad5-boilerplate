import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { usePaginatedList } from './usePaginatedList'

// Fake service: 13 items, paged and filtered by name like the backend
const ITEMS = Array.from({ length: 13 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
const fetchPage = vi.fn(async ({ pageSize, pageIndex, name }) => {
  const list = name ? ITEMS.filter((item) => item.name.includes(name)) : ITEMS
  return { total: list.length, data: list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize) }
})

describe('usePaginatedList', () => {
  it('loads the first page', async () => {
    const { result } = renderHook(() => usePaginatedList(fetchPage, { pageSize: 10 }))
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toHaveLength(10)
    expect(result.current.total).toBe(13)
    expect(result.current.totalPages).toBe(2)
  })

  it('changes page', async () => {
    const { result } = renderHook(() => usePaginatedList(fetchPage, { pageSize: 10 }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.goToPage(2))
    await waitFor(() => expect(result.current.items.map((item) => item.id)).toEqual([11, 12, 13]))
  })

  it('rejects a search shorter than 3 characters and applies a valid one from page 1', async () => {
    const { result } = renderHook(() => usePaginatedList(fetchPage, { pageSize: 10 }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let message
    act(() => {
      message = result.current.applySearch('It')
    })
    expect(message).toMatch(/al menos 3/)

    act(() => {
      message = result.current.applySearch('Item 1')
    })
    expect(message).toBe('')
    await waitFor(() => expect(result.current.total).toBe(5)) // Item 1, 10, 11, 12, 13
    expect(result.current.pageIndex).toBe(1)
  })

  it('exposes the API error', async () => {
    const failing = vi.fn().mockRejectedValue({ response: { data: { Message: 'Sin permisos' } } })
    const { result } = renderHook(() => usePaginatedList(failing))
    await waitFor(() => expect(result.current.error).toBe('Sin permisos'))
    expect(result.current.items).toEqual([])
  })
})
