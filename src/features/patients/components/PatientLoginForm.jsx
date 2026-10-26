import { useForm } from 'react-hook-form'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import TextInput from '../../../components/atoms/TextInput'
import FormField from '../../../components/molecules/FormField'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DNI_PATTERN = /^\d{7,8}$/

function PatientLoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField label="Correo Electrónico" htmlFor="email" error={errors.email?.message}>
        <TextInput
          id="email"
          type="email"
          icon="mail"
          placeholder="ejemplo@correo.com"
          autoComplete="email"
          hasError={!!errors.email}
          {...register('email', {
            required: 'Ingrese su correo electrónico',
            pattern: { value: EMAIL_PATTERN, message: 'Ingrese un correo electrónico válido' },
          })}
        />
      </FormField>

      <FormField label="DNI / Número de Identificación" htmlFor="dni" error={errors.dni?.message}>
        <TextInput
          id="dni"
          icon="idCard"
          inputMode="numeric"
          placeholder="Número de documento"
          hasError={!!errors.dni}
          {...register('dni', {
            required: 'Ingrese su número de documento',
            pattern: { value: DNI_PATTERN, message: 'El documento debe tener 7 u 8 números, sin puntos' },
          })}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
        {isSubmitting ? 'Ingresando...' : 'Ingresar al Portal Médico'}
        {!isSubmitting && <Icon name="arrowRight" size={16} strokeWidth={2} />}
      </Button>
    </form>
  )
}

export default PatientLoginForm
