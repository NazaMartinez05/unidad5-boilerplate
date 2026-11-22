import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../components/templates/AdminLayout'
import PatientLayout from '../components/templates/PatientLayout'
import PatientAppLayout from '../components/templates/PatientAppLayout'
import AppointmentSearchPage from '../features/appointments/pages/AppointmentSearchPage'
import AdminLoginPage from '../features/auth/pages/AdminLoginPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import DoctorAvailabilitiesPage from '../features/doctors/pages/DoctorAvailabilitiesPage'
import DoctorDetailPage from '../features/doctors/pages/DoctorDetailPage'
import DoctorFormPage from '../features/doctors/pages/DoctorFormPage'
import DoctorsPage from '../features/doctors/pages/DoctorsPage'
import PatientAppointmentPage from '../features/patients/pages/PatientAppointmentPage'
import PatientCheckDoctor from '../features/patients/pages/PatientCheckDoctor'
import PatientLoginPage from '../features/patients/pages/PatientLoginPage'
import SpecialitiesPage from '../features/specialities/pages/SpecialitiesPage'
import SpecialityFormPage from '../features/specialities/pages/SpecialityFormPage'
import { ROLES } from '../services/session'
import ProtectedRoute from './ProtectedRoute'

export const router = createBrowserRouter([
  // Main URL of the app: always land on the patient login
  { path: '/', element: <Navigate to="/patients/login" replace /> },

  // Logins: OUTSIDE the protected routes (inside them they would loop:
  // no session -> redirect to the login -> no session...)
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    // Portal del paciente sin sesión (fondo azul, sin barra)
    element: <PatientLayout />,
    children: [{ path: 'patients/login', element: <PatientLoginPage /> }],
  },

  {
    // Panel de administración (menú lateral): only for the Administrador role
    element: <ProtectedRoute allowedRoles={[ROLES.admin]} redirectTo="/admin/login" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'doctors', element: <DoctorsPage /> },
          { path: 'doctors/new', element: <DoctorFormPage /> },
          { path: 'doctors/availabilities', element: <DoctorAvailabilitiesPage /> },
          { path: 'doctors/:id', element: <DoctorFormPage /> },
          { path: 'doctors/:id/detail', element: <DoctorDetailPage /> },
          { path: 'specialities', element: <SpecialitiesPage /> },
          { path: 'specialities/new', element: <SpecialityFormPage /> },
          { path: 'specialities/:id/edit', element: <SpecialityFormPage /> },
          // Opción del menú "Patient Search" (to: '/patients')
          { path: 'patients', element: <AppointmentSearchPage /> },
          // Para agregar una página del admin: importala arriba y sumá su ruta acá.
          // El path va sin barra y coincide con el "to" del menú lateral
          // (components/organisms/Sidebar.jsx), que va con barra:
          //   path: 'doctors'  <->  to: '/doctors'
          // Las secciones sin página caen en esta ruta comodín.
          { path: '*', element: <p className="text-ink-soft">Sección en construcción.</p> },
        ],
      },
    ],
  },

  {
    // Páginas del paciente ya logueado ("Reservar Turno" / "Mis Turnos"): only for the Paciente role
    element: <ProtectedRoute allowedRoles={[ROLES.patient]} redirectTo="/patients/login" />,
    children: [
      {
        element: <PatientAppLayout />,
        children: [
          { path: 'patient-doctor', element: <PatientCheckDoctor /> },
          { path: 'appointments', element: <PatientAppointmentPage /> },
        ],
      },
    ],
  },
])
