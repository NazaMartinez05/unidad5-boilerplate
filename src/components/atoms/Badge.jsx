const VARIANTS = {
  success: 'bg-mint-soft text-mint-dark',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-accent-soft text-accent',
}

function Badge({ children, variant = 'success', withDot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${VARIANTS[variant]}`}
    >
      {withDot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export default Badge