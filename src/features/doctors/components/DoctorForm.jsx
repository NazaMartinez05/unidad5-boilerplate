import { useForm } from 'react-hook-form'
import Button from '../../../components/atoms/Button'
import Select from '../../../components/atoms/Select'
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

  // Opciones del desplegable en el formato que pide el átomo Select
  const specialityOptions = [
    { value: '', label: 'Seleccione especialidad' },
    ...specialities.map((speciality) => ({ value: speciality.id, label: speciality.name })),
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormField label="Nombre Completo del Doctor" htmlFor="name" error={errors.name?.message}>
        <TextInput
          id="name"
          icon="doctors"
          placeholder="Ej: Dr. Alejandro Martínez"
          hasError={!!errors.name}
          {...register('name', {
            required: 'Ingrese el nombre del doctor',
            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            maxLength: { value: 100, message: 'El nombre no puede superar los 100 caracteres' },
          })}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Especialidad" htmlFor="specialityId" error={errors.specialityId?.message}>
          <Select
            id="specialityId"
            options={specialityOptions}
            aria-invalid={!!errors.specialityId}
            {...register('specialityId', { required: 'Seleccione una especialidad' })}
          />
        </FormField>

        <FormField label="Número de Licencia Médica" htmlFor="licenseNumber" error={errors.licenseNumber?.message}>
          <TextInput
            id="licenseNumber"
            icon="idCard"
            placeholder="Ej: MP-45920"
            hasError={!!errors.licenseNumber}
            {...register('licenseNumber', { required: 'Ingrese el número de licencia' })}
          />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default DoctorForm