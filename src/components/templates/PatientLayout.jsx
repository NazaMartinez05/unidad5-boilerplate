import { Outlet } from 'react-router-dom'

// Layout for the patient portal access pages (login): navy background, no navbar
function PatientLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-navy">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default PatientLayout
