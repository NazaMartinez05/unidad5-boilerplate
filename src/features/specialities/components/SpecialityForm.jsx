
import FormField from '../../../components/molecules/FormField'
import TextInput from '../../../components/atoms/TextInput'
import TextArea from '../../../components/atoms/TextArea'
import Button from '../../../components/atoms/Button'
import Select from '../../../components/atoms/Select'

function SpecialityForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
  validationErrors = {},
  errorMessage,
  isSaving = false,
  isEditing = false,
  status,
  onStatusChange,
}) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          label="Nombre de la Especialidad"
          htmlFor="name"
          error={validationErrors.name}
        >
          <TextInput
            id="name"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Ej.: Cardiología Intervencionista"
            maxLength={100}
            required
            hasError={Boolean(validationErrors.name)}
          />
          <p className="text-right text-xs text-ink-soft">
            {name.length}/100
          </p>
        </FormField>

        <FormField
          label="Descripción"
          htmlFor="description"
          error={validationErrors.description}
        >
          <TextArea
            id="description"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Detalle el alcance de la especialidad, procedimientos principales y requisitos de derivación..."
            maxLength={100}
            rows={5}
            required
            hasError={Boolean(validationErrors.description)}
          />
          <p className="text-right text-xs text-ink-soft">
            {description.length}/100
          </p>
                  </FormField>

        <FormField
          label="Estado inicial"
          htmlFor="status"
        >
          <Select
            id="status"
            value={status}
            onChange={onStatusChange}
            options={[
              {
                value: 'ACTIVE',
                label: 'Activo - Disponible para programación',
              },
              {
                value: 'INACTIVE',
                label: 'Inactivo - No disponible para programación',
              },
            ]}
          />
        </FormField>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
          >
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? 'Guardando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Guardar Especialidad'}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default SpecialityForm
