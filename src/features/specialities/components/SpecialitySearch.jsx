
import TextInput from '../../../components/atoms/TextInput'

function SpecialitySearch({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="w-full sm:max-w-xs">
      <TextInput
        icon="search"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Buscar especialidad..."
        aria-label="Buscar especialidad por nombre"
        maxLength={100}
      />
    </form>
  )
}

export default SpecialitySearch
