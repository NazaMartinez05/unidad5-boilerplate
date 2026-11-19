
import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../components/templates/AdminLayout'
import PatientLayout from '../components/templates/PatientLayout'
import PatientAppLayout from '../components/templates/PatientAppLayout'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import DoctorsPage from '../features/doctors/pages/DoctorsPage'
import DoctorFormPage from '../features/doctors/pages/DoctorFormPage'
import DoctorAvailabilitiesPage from '../features/doctors/pages/DoctorAvailabilitiesPage'
import PatientLoginPage from '../features/patients/pages/PatientLoginPage'
<<<<<<< HEAD
//import PatientDoctorPage from '../features/patients/pages/PatientDoctorPage'
=======
import AdminLoginPage from '../features/auth/pages/AdminLoginPage'
>>>>>>> dc7e51e30bbe22662922458dd7a7b35ca3ca0f63

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
<<<<<<< HEAD
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'doctors/new', element: <DoctorFormPage /> },
      { path: 'doctors/:id', element: <DoctorFormPage /> },
      { path: 'doctors/availabilities', element: <DoctorAvailabilitiesPage /> },
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
=======
      {
        path: '*',
        element: <p className="text-ink-soft">Sección en construcción.</p>,
      },
>>>>>>> dc7e51e30bbe22662922458dd7a7b35ca3ca0f63
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
<<<<<<< HEAD
      //{ path: 'patient-doctor', element: <PatientDoctorPage /> },
=======
      { path: 'patient-doctor', element: <p>Sección de pacientes en construcción.</p> },
>>>>>>> dc7e51e30bbe22662922458dd7a7b35ca3ca0f63
      // TODO: página "My Appointments" (turnos del paciente)
      { path: 'appointments', element: <p className="text-ink-soft">Sección en construcción.</p> },
    ],
  },
])
