import Icon from './Icon'

// Receives the props from react-hook-form's register() (including ref)
function TextInput({ icon, hasError = false, ...inputProps }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
          <Icon name={icon} size={16} />
        </span>
      )}
      <input
        {...inputProps}
        aria-invalid={hasError}
        className={`w-full rounded-md border bg-field py-2.5 pr-3 text-sm text-ink-strong outline-none placeholder:text-ink-soft focus:ring-2 ${
          icon ? 'pl-10' : 'pl-3'
        } ${
          hasError
            ? 'border-danger focus:ring-danger/20'
            : 'border-field-line focus:border-brand focus:ring-brand/20'
        }`}
      />
    </div>
  )
}

export default TextInput
