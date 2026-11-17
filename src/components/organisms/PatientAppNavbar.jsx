import { NavLink } from 'react-router-dom'
import Avatar from '../atoms/Avatar'
import Icon from '../atoms/Icon'
import { getSession } from '../../services/session'

const LINKS = [
  { to: '/find-doctors', label: 'Find Doctors' },
  { to: '/appointments', label: 'My Appointments' },
]

const iconButtonClass =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-hover'


function PatientAppNavbar() {
  const { email } = getSession()

  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-line bg-surface px-4 sm:px-6">
      <nav aria-label="Navegación del paciente" className="flex h-full gap-4 sm:gap-6">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex h-full items-center border-b-2 text-sm whitespace-nowrap ${
                isActive ? 'border-brand font-semibold text-brand' : 'border-transparent text-ink hover:text-brand'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-1 sm:gap-2">
        <button type="button" aria-label="Notificaciones" className={iconButtonClass}>
          <Icon name="bell" />
        </button>
        <button type="button" aria-label="Configuración" className={iconButtonClass}>
          <Icon name="settings" />
        </button>
        <Avatar initial={(email ?? 'P').charAt(0).toUpperCase()} />
      </div>
    </header>
  )
}

export default PatientAppNavbar