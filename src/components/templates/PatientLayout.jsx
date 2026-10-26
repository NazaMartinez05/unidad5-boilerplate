import { Outlet } from 'react-router-dom'
import PatientNavbar from '../organisms/PatientNavbar'

// Layout for patient-facing pages (no admin sidebar)
function PatientLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-portal">
      <PatientNavbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default PatientLayout
