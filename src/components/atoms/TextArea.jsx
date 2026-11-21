
function TextArea({ hasError = false, ...textareaProps }) {
  return (
    <textarea
      {...textareaProps}
      aria-invalid={hasError}
      className={`w-full resize-y rounded-md border bg-field px-3 py-3 text-sm text-ink-strong outline-none placeholder:text-ink-soft focus:ring-2 ${
        hasError
          ? 'border-danger focus:ring-danger/20'
          : 'border-field-line focus:border-brand focus:ring-brand/20'
      }`}
    />
  )
}

export default TextArea
