import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../../../services/apiClient'
import DoctorForm from '../components/DoctorForm'
import { createDoctor, getDoctors, getSpecialities, updateDoctor } from '../services/doctorsService'

// Sirve para las dos rutas:
//   /doctors/new  → alta   (no hay id)
//   /doctors/:id  → edición (hay id)
function DoctorFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const location = useLocation()

  // Si venimos desde la tabla, el doctor llega en el "state" del Link
  const doctorFromList = location.state?.doctor

  const [specialities, setSpecialities] = useState([])
  const [doctor, setDoctor] = useState(doctorFromList ?? null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const specialitiesPage = await getSpecialities()
        setSpecialities(specialitiesPage.data)

        // Si se entró directo por URL (sin pasar por la tabla), buscamos el doctor
        if (isEdit && !doctorFromList) {
          const doctorsPage = await getDoctors({ pageSize: 100, pageIndex: 1 })
          const found = doctorsPage.data.find((item) => item.id === id)
          if (!found) setErrorMessage('No se encontró el doctor.')
          setDoctor(found ?? null)
        }
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id, isEdit, doctorFromList])

  const handleSubmit = async (formData) => {
    setErrorMessage('')
    try {
      if (isEdit) await updateDoctor(id, formData)
      else await createDoctor(formData)
      navigate('/doctors')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    }
  }

  // Valores iniciales del formulario: vacíos en el alta, los del doctor en la edición
  const defaultValues = {
    name: doctor?.name ?? '',
    licenseNumber: doctor?.licenseNumber ?? '',
    specialityId: doctor?.speciality?.specialityId ?? '',
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink-strong">
          {isEdit ? 'Editar doctor' : 'Nuevo doctor'}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {isEdit ? 'Modifique los datos del profesional.' : 'Complete los datos del nuevo profesional.'}
        </p>
      </div>

      <section className="rounded-lg border border-line bg-surface p-6">
        {errorMessage && (
          <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </p>
        )}

        {isLoading && <p className="text-sm text-ink-soft">Cargando...</p>}

        {!isLoading && (!isEdit || doctor) && (
          <DoctorForm
            defaultValues={defaultValues}
            specialities={specialities}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/doctors')}
            submitLabel={isEdit ? 'Guardar cambios' : 'Crear doctor'}
          />
        )}
      </section>
    </div>
  )
}

export default DoctorFormPage