import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/hooks/useAuth'

// Route guard. Renders the child routes only when there is a session whose role
// is in allowedRoles; otherwise sends to redirectTo (the login of that area).
// It only protects the UI: the backend enforces access with [Authorize(Policy)].
function ProtectedRoute({ allowedRoles, redirectTo }) {
  const { isAuthenticated, hasRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !hasRole(allowedRoles)) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
