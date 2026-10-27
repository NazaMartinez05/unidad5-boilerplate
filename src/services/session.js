// Role names exactly as the backend returns them
export const ROLES = {
  admin: 'Administrador',
  patient: 'Paciente',
}

export function saveSession({ token, role, email }) {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
  localStorage.setItem('email', email)
}

export function getSession() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email'),
  }
}
