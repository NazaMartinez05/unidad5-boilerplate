// TODO: point these links to their pages once they exist
const LINKS = ['Inicio', 'Soporte', 'Preguntas Frecuentes']

function PatientNavbar() {
  return (
    <header className="grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-surface px-6">
      <span className="text-lg font-bold text-brand">MedPortal</span>

      <nav aria-label="Navegación del portal" className="hidden gap-8 sm:flex">
        {LINKS.map((link) => (
          <a key={link} href="#" className="text-sm text-ink-strong hover:text-brand">
            {link}
          </a>
        ))}
      </nav>

      <a href="#" className="col-start-3 justify-self-end text-sm text-ink-strong hover:text-brand">
        Ayuda
      </a>
    </header>
  )
}

export default PatientNavbar
