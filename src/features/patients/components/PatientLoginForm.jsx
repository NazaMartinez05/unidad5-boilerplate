import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Icon from '../../../components/atoms/Icon'
import TextInput from '../../../components/atoms/TextInput'
import FormField from '../../../components/molecules/FormField'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //expresiones regulares para validar los formatos requeridos
const DNI_PATTERN = /^\d{7,8}$/

function PatientLoginForm({ onSubmit }) {
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm()
  const [showDni, setShowDni] = useState(false)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField label="Correo Electrónico" htmlFor="email" error={errors.email?.message}>
        <TextInput
          id="email"
          type="email"
          icon="mail"
          tone="plain"
          placeholder="paciente@medportal.com"
          autoComplete="email"
          hasError={!!errors.email}
          {...register('email', {
            required: 'Ingrese su correo electrónico',
            pattern: { value: EMAIL_PATTERN, message: 'Ingrese un correo electrónico válido' },
          })}
        />
      </FormField>

      <FormField label="DNI" htmlFor="dni" error={errors.dni?.message}>
        <TextInput
          id="dni"
          type={showDni ? 'text' : 'password'}
          icon="lock"
          tone="plain"
          inputMode="numeric"
          placeholder="••••••••"
          autoComplete="off"
          hasError={!!errors.dni}
          trailing={
            <button
              type="button"
              onClick={() => setShowDni((visible) => !visible)}
              aria-label={showDni ? 'Ocultar DNI' : 'Mostrar DNI'}
              className="cursor-pointer rounded p-1 text-ink-soft hover:text-ink-strong"
            >
              <Icon name={showDni ? 'eyeOff' : 'eye'} size={16} />
            </button>
          }
          {...register('dni', {
            required: 'Ingrese su número de documento',
            pattern: { value: DNI_PATTERN, message: 'El documento debe tener 7 u 8 números, sin puntos' },
          })}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 w-full cursor-pointer rounded-md bg-navy-button px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-button-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar Paciente'}
      </button>
    </form>
  )
}

export default PatientLoginForm
