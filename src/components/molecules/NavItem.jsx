import { NavLink } from 'react-router-dom'
import Icon from '../atoms/Icon'

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.75 rounded-nav px-3 py-2.5 text-sm transition-colors ${
          isActive ? 'bg-accent-soft font-semibold text-accent' : 'text-ink hover:bg-hover'
        }`
      }
    >
      <Icon name={icon} />
      <span>{label}</span>
    </NavLink>
  )
}

export default NavItem
