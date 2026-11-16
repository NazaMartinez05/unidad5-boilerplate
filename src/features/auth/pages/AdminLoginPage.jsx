
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLoginForm from '../components/AdminLoginForm'
import { loginAdmin } from '../services/authService'
import { getApiErrorMessage } from '../../../services/apiClient'
import Logo from '../../../components/atoms/Logo'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (credentials) => {
    setErrorMessage('')

    try {
      const { token, role } = await loginAdmin(credentials)

      if (!token || role?.toUpperCase() !== 'ADMINISTRADOR') {
        localStorage.removeItem('token')
        localStorage.removeItem('role')

        setErrorMessage(
          'El usuario no tiene permisos para acceder al panel de administración.'
        )
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)

      navigate('/', { replace: true })

    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Usuario o contraseña incorrectos. Verifique sus credenciales.'
        )
      )
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#082b4b] px-4 py-10">
      <section className="w-full max-w-md rounded-xl bg-white px-7 py-9 shadow-2xl sm:px-10">
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo />

          <h1 className="mt-3 text-2xl font-bold text-[#15497c]">
            MedPortal
          </h1>

          <h2 className="mt-5 text-xl font-semibold text-ink-strong">
            Acceso de Administrador
          </h2>

          <p className="mt-2 text-sm text-ink">
            Ingrese sus credenciales para acceder al panel de administración.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-md border border-danger/30 bg-danger/10 px-3 py-3 text-sm text-danger"
          >
            {errorMessage}
          </p>
        )}

        <AdminLoginForm onSubmit={handleLogin} />

        <div className="mt-7 border-t border-line pt-5 text-center">
          <p className="text-xs text-ink-soft">
            Acceso exclusivo para personal administrador.
          </p>

          <p className="mt-1 text-xs text-ink-soft">
            MedPortal - Sistema de Gestión Médica
          </p>
        </div>
      </section>
    </main>
  )
}

export default AdminLoginPage
