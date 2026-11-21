import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../components/templates/AdminLayout'
import PatientLayout from '../components/templates/PatientLayout'
import PatientAppLayout from '../components/templates/PatientAppLayout'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import DoctorDetailPage from '../features/doctors/pages/DoctorDetailPage'
import DoctorsPage from '../features/doctors/pages/DoctorsPage'
import DoctorFormPage from '../features/doctors/pages/DoctorFormPage'
import DoctorAvailabilitiesPage from '../features/doctors/pages/DoctorAvailabilitiesPage'
import PatientLoginPage from '../features/patients/pages/PatientLoginPage'
import PatientCheckDoctor from '../features/patients/pages/PatientCheckDoctor'
import PatientAppointmentPage from '../features/patients/pages/PatientAppointmentPage'
import AdminLoginPage from '../features/auth/pages/AdminLoginPage'
import SpecialitiesPage from '../features/specialities/pages/SpecialitiesPage'
import SpecialityFormPage from '../features/specialities/pages/SpecialityFormPage'

export const router = createBrowserRouter([
  // Main URL of the app: always land on the patient login
  { path: '/', element: <Navigate to="/patients/login" replace /> },
  {
    // Panel de administración (menú lateral)
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      // TODO: las secciones del menú que todavía no tienen página (doctors,
      // specialities, patients) caen en esta ruta comodín, que muestra
      // "Sección en construcción." sin que desaparezca el menú.
      //
      // Para agregar tu página (paso a paso en GUIA-AGREGAR-PAGINA.md):
      //   1. Creala en src/features/<seccion>/pages/
      //      (ej: src/features/doctors/pages/DoctorsPage.jsx)
      //   2. Importala arriba de este archivo.
      //   3. Sumá su ruta ACÁ ARRIBA de la ruta '*'. El path va sin barra y
      //      tiene que coincidir con el "to" de esa opción en NAV_ITEMS
      //      (components/organisms/Sidebar.jsx), que va con barra:
      //        path: 'doctors'  <->  to: '/doctors'
      //        { path: 'doctors', element: <DoctorsPage /> },
      { path: '*', element: <p className="text-ink-soft">Sección en construcción.</p> },
      { path: '/admin/login', element: <AdminLoginPage /> },
    ]
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'specialities', element: <SpecialitiesPage /> },
      { path: 'specialities/new', element: <SpecialityFormPage /> },
      { path: 'specialities/:id/edit', element: <SpecialityFormPage /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'doctors/new', element: <DoctorFormPage /> },
      { path: 'doctors/:id', element: <DoctorFormPage /> },
      { path: 'doctors/:id/detail', element: <DoctorDetailPage /> },
      { path: 'doctors/availabilities', element: <DoctorAvailabilitiesPage /> },
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
    // Páginas del paciente ya logueado
    element: <PatientAppLayout />,
    children: [
      { path: 'patient-doctor', element: <PatientCheckDoctor /> },
      // TODO: página "My Appointments" (turnos del paciente)
      { path: 'appointments', element: <PatientAppointmentPage /> },
      { path: 'patient-doctor', element: <p>Sección de pacientes en construcción.</p> },
      { path: 'appointments', element: <p className="text-ink-soft">Sección en construcción.</p> },
    ],
  },
])
