import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../../components/atoms/Icon'
import { getApiErrorMessage } from '../../../services/apiClient'
import PatientLoginForm from '../components/PatientLoginForm'
import { loginPatient } from '../services/patientService'
import { saveSession } from '../../../services/session'

const TEST_CREDENTIALS = {
  email: 'paciente@medportal.com',
  password: 'paciente123',
}

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (credentials) => {
    setErrorMessage('')
    try {
      const { token, role } = await loginPatient(credentials)
      saveSession({ token, role, email: credentials.email })
      navigate('/patient-doctor')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo iniciar sesión. Intente nuevamente más tarde.'))
    }
  }

  return(
    <div className="flex w-full max-w-md flex-col items-center">
      <span aria-hidden="true" className="mb-3 flex size-12 items-center justify-center rounded-xl bg-surface text-navy shadow-md">
        <Icon name="shieldCheck" size={24} strokeWidth={2} />
      </span>
      <p className="mb-8 text-2xl font-semibold text-white">MedPortal</p>
      <section className="w-full rounded-2xl bg-surface px-6 py-7 shadow-[0_20px_40px_rgba(0,0,0,0.25)] sm:px-7">
        <h1 className="text-xl font-bold text-navy">Portal del Paciente</h1>
        <p className="mt-1 mb-6 text-xs text-ink-soft">
          Inicia sesión para reservar y consultar tus turnos médicos
        </p>
        {errorMessage && (
          <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </p>
        )}

        <PatientLoginForm onSubmit={handleLogin} />

        <div className="mt-4 rounded-md border border-field-line bg-field px-3 py-2.5 text-center text-xs text-ink">
          <p className="font-semibold text-ink-strong">Credenciales de prueba:</p>
          <p className="mt-0.5">
            Email: <code className="font-mono">{TEST_CREDENTIALS.email}</code> | Clave:{' '}
            <code className="font-mono">{TEST_CREDENTIALS.password}</code>
          </p>
        </div>
      </section>
      <Link to="/dashboard" className="mt-6 text-xs text-white/70 hover:text-white hover:underline">
        ¿Es personal administrativo o médico? Ingrese aquí →
      </Link>
    </div>
  )
}

export default PatientLoginPage
