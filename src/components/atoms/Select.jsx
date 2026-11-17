import Icon from './Icon'

function Select({ options, ...selectProps }) {
  return (
    <div className="relative">
      <select
        {...selectProps}
        className="w-full cursor-pointer appearance-none rounded-md border border-field-line bg-field py-2.5 pr-10 pl-3 text-sm text-ink-strong outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink">
        <Icon name="chevronDown" size={16} strokeWidth={2} />
      </span>
    </div>
  )
}

export default Select