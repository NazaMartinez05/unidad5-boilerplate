import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../components/templates/AdminLayout'
import PatientLayout from '../components/templates/PatientLayout'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import PatientLoginPage from '../features/patients/pages/PatientLoginPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
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
    ],
  },
  {
    // Páginas del portal de pacientes (MedPortal): usan la barra superior del
    // portal en lugar del menú lateral del admin.
    element: <PatientLayout />,
    children: [{ path: 'patients/login', element: <PatientLoginPage /> }],
  },
])
