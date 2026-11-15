import { useForm } from 'react-hook-form'
import Button from '../../../components/atoms/Button'
import SelectInput from '../../../components/atoms/SelectInput'
import TextInput from '../../../components/atoms/TextInput'
import FormField from '../../../components/molecules/FormField'

// Formulario de alta / edición. No sabe nada del back:
// recibe los valores iniciales y avisa al padre con onSubmit (Hijo → Padre)
function DoctorForm({ defaultValues, specialities, onSubmit, onCancel, submitLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField label="Nombre completo" htmlFor="name" error={errors.name?.message}>
        <TextInput
          id="name"
          placeholder="Ej: Alejandro Rivera"
          hasError={!!errors.name}
          {...register('name', {
            required: 'Ingrese el nombre del doctor',
            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            maxLength: { value: 100, message: 'El nombre no puede superar los 100 caracteres' },
          })}
        />
      </FormField>

      <FormField label="Matrícula" htmlFor="licenseNumber" error={errors.licenseNumber?.message}>
        <TextInput
          id="licenseNumber"
          placeholder="Ej: MP-4920"
          hasError={!!errors.licenseNumber}
          {...register('licenseNumber', { required: 'Ingrese la matrícula' })}
        />
      </FormField>

      <FormField label="Especialidad" htmlFor="specialityId" error={errors.specialityId?.message}>
        <SelectInput
          id="specialityId"
          hasError={!!errors.specialityId}
          {...register('specialityId', { required: 'Seleccione una especialidad' })}
        >
          <option value="">Seleccione una especialidad...</option>
          {specialities.map((speciality) => (
            <option key={speciality.id} value={speciality.id}>
              {speciality.name}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-hover"
        >
          Cancelar
        </button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default DoctorForm