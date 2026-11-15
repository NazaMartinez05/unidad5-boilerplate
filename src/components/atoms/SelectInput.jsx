// Desplegable con el mismo estilo que TextInput.
// Recibe las props de register() de react-hook-form (incluida la ref)
function SelectInput({ hasError = false, children, ...selectProps }) {
  return (
    <select
      {...selectProps}
      aria-invalid={hasError}
      className={`w-full rounded-md border bg-field px-3 py-2.5 text-sm text-ink-strong outline-none focus:ring-2 ${
        hasError
          ? 'border-danger focus:ring-danger/20'
          : 'border-field-line focus:border-brand focus:ring-brand/20'
      }`}
    >
      {children}
    </select>
  )
}

export default SelectInput