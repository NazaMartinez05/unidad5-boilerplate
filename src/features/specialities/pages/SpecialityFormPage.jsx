
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  createSpeciality,
  updateSpeciality,
} from '../services/specialitiesService'
import SpecialityForm from '../components/SpecialityForm'

function SpecialityFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const isEditing = Boolean(id)
  const speciality = location.state?.speciality

  const [name, setName] = useState(speciality?.name || '')
  const [description, setDescription] = useState(
    speciality?.description || ''
  )
  const [status, setStatus] = useState('ACTIVE')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

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

  if (isEditing && !speciality) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-line bg-surface p-6 shadow-sm">
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
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <p className="mb-2 text-sm font-medium text-brand">
          Especialidades / {isEditing ? 'Editar' : 'Agregar nueva especialidad'}
        </p>

        <h1 className="text-2xl font-bold text-ink-strong">
          {isEditing ? 'Editar especialidad' : 'Registrar Nueva Especialidad'}
        </h1>

        <p className="mt-1 text-sm text-ink-soft">
          Complete la información técnica y administrativa para registrar
          una especialidad médica en el sistema.
        </p>
      </header>

      <SpecialityForm
        name={name}
        description={description}
        status={status}
        onStatusChange={(event) => setStatus(event.target.value)}
        onNameChange={(event) => {
          setName(event.target.value)
          setValidationErrors((current) => ({
            ...current,
            name: '',
          }))
        }}
        onDescriptionChange={(event) => {
          setDescription(event.target.value)
          setValidationErrors((current) => ({
            ...current,
            description: '',
          }))
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/specialities')}
        validationErrors={validationErrors}
        errorMessage={errorMessage}
        isSaving={isSaving}
        isEditing={isEditing}
      />
    </div>
  )
}

export default SpecialityFormPage
