
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLoginForm from '../components/AdminLoginForm'
import { loginAdmin } from '../services/authService'
import { getApiErrorMessage } from '../../../services/apiClient'
import AdminLoginTemplate from '../../../components/templates/AdminLoginTemplate'

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
