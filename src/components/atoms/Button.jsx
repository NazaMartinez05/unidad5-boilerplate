function Button({ children, type = 'button', className = '', ...buttonProps }) {
  return (
    <button
      type={type}
      {...buttonProps}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
