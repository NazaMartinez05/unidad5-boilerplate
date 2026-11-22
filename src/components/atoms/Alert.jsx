const VARIANTS = {
  error: 'border-danger/30 bg-danger/10 text-danger',
  success: 'border-mint bg-mint-soft text-mint-dark',
  info: 'border-highlight-line bg-highlight text-ink-strong',
}

// Page message (error / success / info). Renders nothing without content, so
// pages can write <Alert>{errorMessage}</Alert> without an extra condition.
// className: spacing for each place it is used (e.g. "mx-5 mb-4").
function Alert({ variant = 'error', className = '', children }) {
  if (!children) return null

  return (
    <p
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-3 py-2 text-sm ${VARIANTS[variant] ?? VARIANTS.error} ${className}`}
    >
      {children}
    </p>
  )
}

export default Alert
