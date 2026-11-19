
import { useForm } from 'react-hook-form'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import TextInput from '../../../components/atoms/TextInput'
import FormField from '../../../components/molecules/FormField'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function AdminLoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FormField
        label="Correo Electrónico"
        htmlFor="email"
        error={errors.email?.message}
      >
        <TextInput
          id="email"
          type="email"
          icon="mail"
          placeholder="admin@medportal.com"
          autoComplete="username"
          hasError={!!errors.email}
          {...register('email', {
            required: 'Ingrese su correo electrónico',
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Ingrese un correo electrónico válido',
            },
          })}
        />
      </FormField>

      <FormField
        label="Contraseña"
        htmlFor="password"
        error={errors.password?.message}
      >
        <TextInput
          id="password"
          type="password"
          icon="lock"
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          hasError={!!errors.password}
          {...register('password', {
           required: 'Ingrese su contraseña',
  minLength: {
    value: 8,
    message: 'La contraseña debe tener al menos 8 caracteres',
  },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).+$/,
    message: 'La contraseña debe contener al menos una mayúscula y un símbolo',
            },
          })}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full"
      >
        {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
        {!isSubmitting && (
          <Icon name="arrowRight" size={16} strokeWidth={2} />
        )}
      </Button>
    </form>
  )
}

export default AdminLoginForm
