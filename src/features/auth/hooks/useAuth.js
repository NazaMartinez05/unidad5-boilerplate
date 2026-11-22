import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Session of the logged-in user: { token, role, email, dni, isAuthenticated, hasRole, login, logout }
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>')
  return auth
}
