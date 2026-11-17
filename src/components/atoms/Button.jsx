const VARIANTS = {
  primary: 'border border-brand bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-brand bg-surface text-brand hover:bg-highlight',
}

function Button({ children, type = 'button', variant = 'primary', className = '', ...buttonProps }) {
  return (
    <button
      type={type}
      {...buttonProps}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
