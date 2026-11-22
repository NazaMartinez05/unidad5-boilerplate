import { createContext } from 'react'

// Value: { token, role, email, dni, isAuthenticated, hasRole(roles), login(session), logout() }
// Provided by AuthProvider, read with useAuth().
export const AuthContext = createContext(null)
