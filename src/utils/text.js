// "Dra. Elena Martínez" -> "EM" (titles like Dr./Dra. are skipped, at most 2 letters)
export function getInitials(name) {
  return String(name ?? '')
    .split(' ')
    .filter((word) => word && !/^dra?\.?$/i.test(word))
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

// The backend does not return the patient's name: it is built from the email
// ("johnathan.doe@mail.com" -> "Johnathan Doe")
export function getNameFromEmail(email, fallback = 'Paciente') {
  const user = String(email ?? '').split('@')[0]
  const name = user
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return name || fallback
}
