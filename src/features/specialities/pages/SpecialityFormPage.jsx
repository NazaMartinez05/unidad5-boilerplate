
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  createSpeciality,
  updateSpeciality,
} from '../services/specialitiesService'

function SpecialityFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  // Si existe un ID, estamos editando.
  const isEditing = Boolean(id)

  // Para editar recibimos la especialidad desde el listado.
  const speciality = location.state?.speciality

  const [name, setName] = useState(speciality?.name || '')
  const [description, setDescription] = useState(
    speciality?.description || ''
  )

  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [validationErrors, setValidationErrors] = useState({})

  // Validaciones del formulario
  const validateForm = () => {
    const errors = {}

    const cleanName = name.trim()
    const cleanDescription = description.trim()

    if (!cleanName) {
      errors.name = 'El nombre es obligatorio.'
    } else if (cleanName.length < 3 || cleanName.length > 100) {
      errors.name = 'El nombre debe tener entre 3 y 100 caracteres.'
    }

    if (!cleanDescription) {
      errors.description = 'La descripción es obligatoria.'
    } else if (
      cleanDescription.length < 10 ||
      cleanDescription.length > 100
    ) {
      errors.description =
        'La descripción debe tener entre 10 y 100 caracteres.'
    }

    setValidationErrors(errors)

    return Object.keys(errors).length === 0
  }

  // Guardar especialidad
  const handleSubmit = async (event) => {
    event.preventDefault()

    setErrorMessage('')

    if (!validateForm()) return

    const specialityData = {
      name: name.trim(),
      description: description.trim(),
    }

    setIsSaving(true)

    try {
      if (isEditing) {
        await updateSpeciality(id, specialityData)
      } else {
        await createSpeciality(specialityData)
      }

      navigate('/specialities', {
        replace: true,
        state: {
          successMessage: isEditing
            ? 'La especialidad se actualizó correctamente.'
            : 'La especialidad se creó correctamente.',
        },
      })

    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))

    } finally {
      setIsSaving(false)
    }
  }

  // No se puede editar sin los datos recibidos desde el listado.
  if (isEditing && !speciality) {
    return (
      <div className="mx-auto max-w-3xl">

        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">

          <h1 className="text-xl font-bold text-ink-strong">
            No se pudo cargar la especialidad
          </h1>

          <p className="mt-3 text-sm text-ink-soft">
            Para editar una especialidad, ingresá desde el listado
            seleccionando el botón Editar correspondiente.
          </p>

          <Link
            to="/specialities"
            className="mt-5 inline-flex rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Volver al listado
          </Link>

        </div>

      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">

      {/* Encabezado */}
      <div className="mb-7">

        <p className="mb-2 text-sm font-medium text-brand">
          Administración / Especialidades
        </p>

        <h1 className="text-3xl font-bold text-ink-strong">
          {isEditing ? 'Editar especialidad' : 'Nueva especialidad'}
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          {isEditing
            ? 'Modifique los datos de la especialidad seleccionada.'
            : 'Complete los datos para registrar una nueva especialidad médica.'}
        </p>

      </div>

      {/* Formulario */}
      <section className="rounded-xl border border-line bg-surface p-6 shadow-sm">

        <form onSubmit={handleSubmit}>

          {/* Nombre */}
          <div className="mb-6">

            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-ink-strong"
            >
              Nombre de la especialidad *
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setValidationErrors((current) => ({
                  ...current,
                  name: '',
                }))
              }}
              placeholder="Ej.: Cardiología"
              maxLength={100}
              required
              className="w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-strong outline-none focus:border-brand"
            />

            <div className="mt-1 flex justify-between gap-2">

              {validationErrors.name ? (
                <p className="text-xs text-danger">
                  {validationErrors.name}
                </p>
              ) : (
                <p className="text-xs text-ink-soft">
                  Entre 3 y 100 caracteres.
                </p>
              )}

              <span className="text-xs text-ink-soft">
                {name.length}/100
              </span>

            </div>

          </div>

          {/* Descripción */}
          <div className="mb-6">

            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-ink-strong"
            >
              Descripción *
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value)
                setValidationErrors((current) => ({
                  ...current,
                  description: '',
                }))
              }}
              placeholder="Describa brevemente la especialidad médica..."
              maxLength={100}
              rows={4}
              required
              className="w-full resize-y rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-strong outline-none focus:border-brand"
            />

            <div className="mt-1 flex justify-between gap-2">

              {validationErrors.description ? (
                <p className="text-xs text-danger">
                  {validationErrors.description}
                </p>
              ) : (
                <p className="text-xs text-ink-soft">
                  Entre 10 y 100 caracteres.
                </p>
              )}

              <span className="text-xs text-ink-soft">
                {description.length}/100
              </span>

            </div>

          </div>

          {/* Error del backend */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {errorMessage}
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">

            <Link
              to="/specialities"
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-soft hover:bg-hover"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Registrar especialidad'}
            </button>

          </div>

        </form>

      </section>

    </div>
  )
}

export default SpecialityFormPage
