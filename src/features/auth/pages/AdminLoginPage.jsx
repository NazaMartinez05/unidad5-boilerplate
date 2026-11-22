import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLoginForm from '../components/AdminLoginForm'
import { useAuth } from '../hooks/useAuth'
import { loginAdmin } from '../services/authService'
import { getApiErrorMessage } from '../../../services/apiClient'
import { ROLES, roleMatches } from '../../../services/session'
import AdminLoginTemplate from '../../../components/templates/AdminLoginTemplate'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (credentials) => {
    setErrorMessage('')

    try {
      const { token, role } = await loginAdmin(credentials)

      // Only administrators get a session here (nothing is saved otherwise)
      if (!token || !roleMatches(role, [ROLES.admin])) {
        setErrorMessage(
          'El usuario no tiene permisos para acceder al panel de administración.'
        )
        return
      }

      login({ token, role, email: credentials.email })

      // '/' redirects to the patient login, so go straight to the admin panel
      navigate('/dashboard', { replace: true })

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
    <AdminLoginTemplate errorMessage={errorMessage}>
      <AdminLoginForm onSubmit={handleLogin} />
    </AdminLoginTemplate>
  )
}

export default AdminLoginPage
