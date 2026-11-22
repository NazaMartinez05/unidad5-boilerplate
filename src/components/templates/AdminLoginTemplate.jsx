
import { Link } from 'react-router-dom'
import Logo from '../atoms/Logo'
import Alert from '../atoms/Alert'

function AdminLoginTemplate({ errorMessage, children }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#082b4b] px-4 py-8">

      <div className="mb-5 flex flex-col items-center text-center">
        <Logo />

        <h1 className="mt-2 text-2xl font-bold text-white">
          MedPortal
        </h1>
      </div>

      <section className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">

        <div className="px-7 py-8 sm:px-9">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#15497c]">
              Bienvenido de nuevo
            </h2>

            <p className="mt-2 text-sm text-ink-soft">
              Por favor, autentíquese para acceder al portal de proveedores.
            </p>
          </div>

          <Alert className="mb-5 py-3">{errorMessage}</Alert>

          {children}

          <div className="mt-4 rounded-md border border-[#d5e7f5] bg-[#edf6fc] px-4 py-3 text-center">
            <p className="text-xs font-semibold text-[#15497c]">
              Credenciales de prueba
            </p>

            <p className="mt-1 text-xs text-ink">
              Email: admin@medportal.com | Clave: Admin123!
            </p>
          </div>

        </div>

        <div className="border-t border-[#e2edf5] bg-[#f0f7fc] px-7 py-5 sm:px-9">
          <div className="flex gap-3">
            <span className="text-[#15497c]" aria-hidden="true">
              ⛨
            </span>

            <div>
              <p className="text-xs font-semibold text-[#15497c]">
                Solo Acceso Seguro
              </p>

              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Este sistema es para personal médico autorizado.
                Los intentos de acceso no autorizados son registrados
                y monitoreados para su cumplimiento.
              </p>
            </div>
          </div>
        </div>

      </section>

      <Link
        to="/patients/login"
        className="mt-5 text-xs text-white/80 transition hover:text-white hover:underline"
      >
        ← Volver al Portal de Pacientes
      </Link>

    </main>
  )
}

export default AdminLoginTemplate
