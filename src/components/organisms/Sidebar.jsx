import Brand from '../molecules/Brand'
import NavItem from '../molecules/NavItem'
import UserCard from '../molecules/UserCard'
import Icon from '../atoms/Icon'

const NAV_ITEMS = [
  { to: '/', icon: 'dashboard', label: 'Panel de administración' },
  { to: '/doctors', icon: 'doctors', label: 'Doctors' },
  { to: '/specialities', icon: 'specialities', label: 'Specialties' },
  { to: '/patients', icon: 'patients', label: 'Patient Search' },
]

const footerLinkClass =
  'flex w-full items-center gap-2.5 rounded-nav px-3 py-2.25 text-left text-[13.5px] text-ink-soft hover:bg-hover'

function Sidebar({ isOpen, onNavigate }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-62 flex-col border-r border-line bg-surface px-4 py-5.5 transition-transform duration-250 desktop:translate-x-0 desktop:shadow-none ${
        isOpen ? 'translate-x-0 shadow-[8px_0_24px_rgba(15,23,42,0.12)]' : '-translate-x-full'
      }`}
    >
      <Brand name="Medical Center" subtitle="Admin Portal" />

      <nav aria-label="Navegación principal">
        <ul className="flex flex-col gap-0.75">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavItem {...item} onClick={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3.5">
        <a href="#" className={footerLinkClass}>
          <Icon name="help" size={16} />
          <span>Help Center</span>
        </a>
        <button type="button" className={`${footerLinkClass} cursor-pointer hover:text-danger`}>
          <Icon name="logout" size={16} />
          <span>Logout</span>
        </button>

        <UserCard name="Admin User" role="Super Administrator" />
      </div>
    </aside>
  )
}

export default Sidebar
