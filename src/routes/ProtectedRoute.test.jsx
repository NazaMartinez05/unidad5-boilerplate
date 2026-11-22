import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AuthContext } from '../features/auth/context/AuthContext'
import { roleMatches, ROLES } from '../services/session'
import ProtectedRoute from './ProtectedRoute'

// Renders /dashboard behind an admin-only ProtectedRoute with the given session
function renderAt(session) {
  const auth = {
    ...session,
    isAuthenticated: Boolean(session.token),
    hasRole: (allowed) => roleMatches(session.role, allowed),
  }
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/admin/login" element={<p>Login de admin</p>} />
          <Route element={<ProtectedRoute allowedRoles={[ROLES.admin]} redirectTo="/admin/login" />}>
            <Route path="/dashboard" element={<p>Panel</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  afterEach(cleanup) // without Vitest globals, Testing Library does not clean the DOM by itself

  it('sends to the login without a session', () => {
    renderAt({ token: null, role: null })
    expect(screen.getByText('Login de admin')).toBeTruthy()
  })

  it('sends to the login with a role that is not allowed', () => {
    renderAt({ token: 't', role: ROLES.patient })
    expect(screen.getByText('Login de admin')).toBeTruthy()
  })

  it('renders the page for an allowed role (any case)', () => {
    renderAt({ token: 't', role: 'ADMINISTRADOR' })
    expect(screen.getByText('Panel')).toBeTruthy()
  })
})
