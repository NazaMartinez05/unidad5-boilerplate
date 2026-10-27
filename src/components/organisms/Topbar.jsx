import Icon from '../atoms/Icon'

// Only visible below the desktop breakpoint
function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-surface px-3.5 desktop:hidden">
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={onMenuClick}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink"
      >
        <Icon name="menu" size={22} strokeWidth={2} />
      </button>
      <span className="font-semibold text-ink-strong">Medical Center</span>
    </header>
  )
}

export default Topbar
