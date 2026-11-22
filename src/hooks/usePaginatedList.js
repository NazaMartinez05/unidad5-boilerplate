import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../services/apiClient'

export const MIN_SEARCH_LENGTH = 3

// Paginated list with a name search, shared by the admin lists (doctors,
// specialities, dashboard). The page only renders; this hook owns the data flow.
//
// fetchPage({ pageSize, pageIndex, name }) -> { data, total } (the backend's paged shape).
// Must be a stable function (a service import), or wrapped in useCallback.
export function usePaginatedList(fetchPage, { pageSize = 10 } = {}) {
  const [pageIndex, setPageIndex] = useState(1)
  const [search, setSearch] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // key: the request this result belongs to (page | search | reload)
  const [result, setResult] = useState({ key: null, items: [], total: 0, error: '' })

  const requestKey = `${pageIndex}|${search}|${reloadKey}`

  useEffect(() => {
    let ignore = false
    fetchPage({ pageSize, pageIndex, name: search })
      .then((page) => {
        if (!ignore) setResult({ key: requestKey, items: page?.data ?? [], total: page?.total ?? 0, error: '' })
      })
      .catch((error) => {
        if (!ignore) setResult({ key: requestKey, items: [], total: 0, error: getApiErrorMessage(error) })
      })
    // A slower old request must not overwrite the newest one
    return () => {
      ignore = true
    }
  }, [fetchPage, pageSize, pageIndex, search, requestKey])

  // Loading until the result matches the current page/search (no setState inside the effect)
  const isLoading = result.key !== requestKey

  // Returns the validation message ('' when the search was applied)
  const applySearch = useCallback((text) => {
    const name = String(text ?? '').trim()
    if (name && name.length < MIN_SEARCH_LENGTH) {
      return `Ingrese al menos ${MIN_SEARCH_LENGTH} caracteres para buscar.`
    }
    setPageIndex(1)
    setSearch(name)
    setReloadKey((key) => key + 1)
    return ''
  }, [])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return {
    items: result.items,
    total: result.total,
    error: isLoading ? '' : result.error,
    isLoading,
    hasLoaded: result.key !== null, // at least one response arrived
    pageIndex,
    pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
    search,
    goToPage: setPageIndex,
    applySearch,
    reload,
  }
}
