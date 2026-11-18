import Icon from './Icon'

const TONES = {
  field: 'bg-field',
  plain: 'bg-surface',
}

// Receives the props from react-hook-form's register() (including ref).
// "trailing" renders an element at the right edge (e.g. a show/hide button).
function TextInput({ icon, trailing, tone = 'field', hasError = false, ...inputProps }) {
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
        className={`w-full rounded-md border py-2.5 text-sm text-ink-strong outline-none placeholder:text-ink-soft focus:ring-2 ${
          TONES[tone]
        } ${icon ? 'pl-10' : 'pl-3'} ${trailing ? 'pr-10' : 'pr-3'} ${
          hasError
            ? 'border-danger focus:ring-danger/20'
            : 'border-field-line focus:border-brand focus:ring-brand/20'
        }`}
      />
      {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
    </div>
  )
}

export default TextInput
