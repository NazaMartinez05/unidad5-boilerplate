// Role names exactly as the backend returns them
export const ROLES = {
  admin: 'Administrador',
  patient: 'Paciente',
}

// dni: only for patients (the token does not include it and booking needs it)
export function saveSession({ token, role, email, dni }) {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
  localStorage.setItem('email', email)
  if (dni) localStorage.setItem('dni', dni)
  else localStorage.removeItem('dni')
}

export function getSession() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email'),
    dni: localStorage.getItem('dni'),
  }
}
