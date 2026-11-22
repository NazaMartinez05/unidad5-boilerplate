import { Outlet } from 'react-router-dom'
import PatientAppNavbar from '../organisms/PatientAppNavbar'

// Layout for logged-in patients. Access control lives in the router (ProtectedRoute).
function PatientAppLayout() {
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
