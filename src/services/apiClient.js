import axios from 'axios'
import { clearSession, getSession, isTokenExpired, SESSION_EXPIRED_EVENT } from './session'

// Ends the session and tells AuthProvider (ProtectedRoute then sends to the login)
function expireSession() {
  clearSession()
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

// Empty baseURL in development: requests go to /api on the Vite server,
// which proxies them to the backend (see vite.config.js).
// In production set VITE_API_URL to the backend URL.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
})

// Send the token saved at login on every request (protected endpoints need it).
// An already expired token is not sent: the session ends and the request is cancelled.
apiClient.interceptors.request.use((config) => {
  const { token } = getSession()
  if (token && isTokenExpired(token)) {
    expireSession()
    return Promise.reject(new axios.CanceledError('La sesión venció. Inicie sesión nuevamente.'))
  }
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 = token missing, invalid or expired: end the session so ProtectedRoute
// sends the user back to the login. Login calls are excluded: there a 401 means
// wrong credentials and the form shows the error.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes('/api/auth/')
    if (error.response?.status === 401 && !isLoginCall && getSession().token) expireSession()
    return Promise.reject(error)
  },
)

// The backend returns errors as { ErrorCode, Message, Details } (PascalCase)
export function getApiErrorMessage(error, fallback = 'No se pudo completar la operación. Intente nuevamente.') {
  return error.response?.data?.Message ?? fallback
}
