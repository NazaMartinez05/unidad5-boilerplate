import axios from 'axios'

// Empty baseURL in development: requests go to /api on the Vite server,
// which proxies them to the backend (see vite.config.js).
// In production set VITE_API_URL to the backend URL.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
})

// Send the token saved at login on every request (protected endpoints need it)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// The backend returns errors as { ErrorCode, Message, Details } (PascalCase)
export function getApiErrorMessage(error, fallback = 'No se pudo completar la operación. Intente nuevamente.') {
  return error.response?.data?.Message ?? fallback
}
