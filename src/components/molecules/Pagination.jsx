import Icon from '../atoms/Icon'

const buttonClass =
  'inline-flex size-7 cursor-pointer items-center justify-center rounded text-xs disabled:cursor-not-allowed disabled:opacity-40'

// page starts at 1
function Pagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="Paginación" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${buttonClass} border border-line bg-surface text-ink hover:bg-hover`}
      >
        <Icon name="chevronLeft" size={14} strokeWidth={2} />
      </button>

      {pages.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onPageChange(number)}
          className={`${buttonClass} ${number === page ? 'bg-brand font-semibold text-white' : 'text-ink hover:bg-hover'}`}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        aria-label="Página siguiente"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${buttonClass} border border-line bg-surface text-ink hover:bg-hover`}
      >
        <Icon name="chevronRight" size={14} strokeWidth={2} />
      </button>
    </nav>
  )
}

export default Pagination