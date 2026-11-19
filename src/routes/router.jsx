
import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../components/templates/AdminLayout'
import PatientLayout from '../components/templates/PatientLayout'
import PatientAppLayout from '../components/templates/PatientAppLayout'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import PatientLoginPage from '../features/patients/pages/PatientLoginPage'
import AdminLoginPage from '../features/auth/pages/AdminLoginPage'
import PatientDoctorPage from '../features/patients/pages/PatientDoctorPage'

export const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: '*',
        element: <p className="text-ink-soft">Sección en construcción.</p>,
      },
    ],
  },
  {
    element: <PatientLayout />,
    children: [
      { path: 'patients/login', element: <PatientLoginPage /> },
    ],
  },
  {
    // Páginas del paciente ya logueado: barra con "Find Doctors" / "My Appointments".
    // Si no hay sesión de paciente, PatientAppLayout redirige al login.
    element: <PatientAppLayout />,
    children: [
      { path: 'patient-doctor', element: <PatientDoctorPage /> },
      // TODO: página "My Appointments" (turnos del paciente)
      { path: 'appointments', element: <p className="text-ink-soft">Sección en construcción.</p> },
    ],
  },
])
