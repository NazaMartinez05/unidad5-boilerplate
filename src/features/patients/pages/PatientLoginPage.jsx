import { useState } from 'react'
import { getApiErrorMessage } from '../../../services/apiClient'
import PatientLoginForm from '../components/PatientLoginForm'
import { loginPatient } from '../services/patientService'

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (credentials) => {
    setErrorMessage('')
    try {
      const { token, role } = await loginPatient(credentials)
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      // TODO: redirect to the patient home page once it exists
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo iniciar sesión. Intente nuevamente más tarde.'))
    }
  }

  return (
    <section className="w-full max-w-sm rounded-lg border border-line bg-surface px-6 py-8 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
      <div className="mb-6 text-center">
        <p className="mb-3 text-lg font-bold text-brand">MedPortal</p>
        <h1 className="mb-2 text-xl font-semibold text-ink-strong">Acceso al Paciente</h1>
        <p className="text-sm text-ink">
          Ingrese sus credenciales de identificación para continuar.
        </p>
      </div>

      {errorMessage && (
        <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <PatientLoginForm onSubmit={handleLogin} />

      <div className="mt-6 border-t border-line pt-5 text-center">
        <p className="mb-3 text-sm text-ink">¿No tiene una cuenta o tiene problemas para acceder?</p>
        <a href="#" className="text-sm font-semibold text-brand hover:underline">
          Contactar con soporte técnico
        </a>
      </div>
    </section>
  )
}

export default PatientLoginPage
