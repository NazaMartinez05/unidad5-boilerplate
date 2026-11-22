// Session storage: the ONLY module that reads or writes the session in localStorage.
// Components use it through useAuth() (features/auth/hooks/useAuth.js).

// Role names exactly as the backend returns them
export const ROLES = {
  admin: 'Administrador',
  patient: 'Paciente',
}

const KEYS = ['token', 'role', 'email', 'dni']

// Fired when the API rejects the token (401): AuthProvider listens and logs out
export const SESSION_EXPIRED_EVENT = 'auth:session-expired'

// dni: only for patients (the token does not include it and booking needs it)
export function saveSession({ token, role, email, dni }) {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
  if (email) localStorage.setItem('email', email)
  else localStorage.removeItem('email')
  if (dni) localStorage.setItem('dni', dni)
  else localStorage.removeItem('dni')
}

export function clearSession() {
  KEYS.forEach((key) => localStorage.removeItem(key))
}

export function getSession() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email'),
    dni: localStorage.getItem('dni'),
  }
}

// true when `role` is one of `allowedRoles` (case-insensitive: "ADMINISTRADOR" = "Administrador")
export function roleMatches(role, allowedRoles) {
  const current = String(role ?? '').toLowerCase()
  return Boolean(current) && allowedRoles.some((allowed) => allowed.toLowerCase() === current)
}

// Expiry of a JWT in milliseconds (its "exp" claim), or null when it can't be read.
// Only reads the payload: the signature is checked by the backend.
export function getTokenExpiry(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json)
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

// true when the token has an "exp" already past. A token without a readable
// "exp" counts as valid: the backend decides (401) and the interceptor logs out.
export function isTokenExpired(token, now = Date.now()) {
  const expiry = token ? getTokenExpiry(token) : null
  return expiry !== null && expiry <= now
}
