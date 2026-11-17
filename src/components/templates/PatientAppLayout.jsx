import { Navigate, Outlet } from 'react-router-dom'
import PatientAppNavbar from '../organisms/PatientAppNavbar'
import { getSession, ROLES } from '../../services/session'

// Layout for logged-in patients. Without a patient session, back to the login.
function PatientAppLayout() {
  const { token, role } = getSession()

  if (!token || role !== ROLES.patient) {
    return <Navigate to="/patients/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-portal">
      <PatientAppNavbar />
      <main className="flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default PatientAppLayout