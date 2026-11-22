import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearSession,
  getSession,
  getTokenExpiry,
  isTokenExpired,
  roleMatches,
  saveSession,
  SESSION_EXPIRED_EVENT,
} from '../../../services/session'
import { AuthContext } from './AuthContext'

// The stored session, discarding it when its token already expired
function readValidSession() {
  const session = getSession()
  if (isTokenExpired(session.token)) {
    clearSession()
    return getSession()
  }
  return session
}

// Single source of truth for the session (admin and patient). Wraps the router in App.jsx.
function AuthProvider({ children }) {
  const [session, setSession] = useState(readValidSession)

  useEffect(() => {
    const syncFromStorage = () => setSession(readValidSession())
    // 401 or expired token in apiClient (it clears the storage and fires this event)
    window.addEventListener(SESSION_EXPIRED_EVENT, syncFromStorage)
    // Login / logout in another browser tab
    window.addEventListener('storage', syncFromStorage)
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, syncFromStorage)
      window.removeEventListener('storage', syncFromStorage)
    }
  }, [])

  const login = useCallback((data) => {
    saveSession(data)
    setSession(getSession())
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(getSession())
  }, [])

  // Log out right when the token expires, without waiting for the next API call
  useEffect(() => {
    const expiry = session.token ? getTokenExpiry(session.token) : null
    if (expiry === null) return
    // setTimeout holds at most ~24.8 days; longer tokens are checked on the next request
    const delay = Math.min(Math.max(expiry - Date.now(), 0), 2 ** 31 - 1)
    const timer = setTimeout(logout, delay)
    return () => clearTimeout(timer)
  }, [session.token, logout])

  const value = useMemo(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.token),
      hasRole: (allowedRoles) => roleMatches(session.role, allowedRoles),
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
