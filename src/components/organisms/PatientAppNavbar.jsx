import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Icon from '../atoms/Icon'
import { clearSession, getSession } from '../../services/session'

const LINKS = [
  { to: '/patient-doctor', label: 'Reservar Turno' },
  { to: '/appointments', label: 'Mis Turnos' },
]

// The backend does not return the patient's name: it is taken from the email
// ("johnathan.doe@mail.com" -> "Johnathan Doe")
function getDisplayName(email) {
  const user = (email ?? '').split('@')[0]
  const name = user
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return name || 'Paciente'
}

const getInitials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()

// Desktop: links inline. Mobile (< md): logo, avatar and a menu button.
function PatientAppNavbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const name = getDisplayName(getSession().email)

  const handleLogout = () => {
    clearSession()
    navigate('/patients/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
      isActive ? 'bg-navy-button font-semibold text-white' : 'text-ink hover:bg-hover hover:text-ink-strong'
    }`

  return (
    <header className="relative z-20 border-b border-line bg-surface">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-navy text-white">
              <Icon name="lock" size={16} strokeWidth={2} />
            </span>
            <span className="text-base font-bold text-ink-strong">Portal Salud</span>
          </div>

          <nav aria-label="Navegación del paciente" className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notificaciones"
            className="hidden size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-hover md:inline-flex"
          >
            <Icon name="bell" size={18} />
          </button>

          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-highlight text-xs font-bold text-brand"
            >
              {getInitials(name)}
            </span>
            <span className="hidden text-sm font-semibold text-ink-strong md:inline">{name}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden cursor-pointer rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink hover:bg-hover hover:text-ink-strong md:inline-block"
          >
            Salir
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-line text-ink-strong hover:bg-hover md:hidden"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav
          aria-label="Navegación del paciente"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-surface px-4 py-3 shadow-[0_8px_16px_rgba(15,23,42,0.08)] md:hidden"
        >
          <p className="px-3 pb-2 text-sm font-semibold text-ink-strong">{name}</p>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 cursor-pointer rounded-md px-3 py-1.5 text-left text-sm text-danger hover:bg-danger/5"
          >
            Salir
          </button>
        </nav>
      )}
    </header>
  )
}

export default PatientAppNavbar
