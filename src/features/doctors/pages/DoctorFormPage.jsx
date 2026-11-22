import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../../components/atoms/Icon'
import { getApiErrorMessage } from '../../../services/apiClient'
import DoctorForm from '../components/DoctorForm'
import Alert from '../../../components/atoms/Alert'
import { createDoctor, getAllDoctors, getAllSpecialities, updateDoctor } from '../services/doctorsService'

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
        setSpecialities(await getAllSpecialities())

        // Si se entró directo por URL (sin pasar por la tabla), buscamos el doctor
        if (isEdit && !doctorFromList) {
          const doctors = await getAllDoctors()
          const found = doctors.find((item) => item.id === id)
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

  const title = isEdit ? 'Editar Doctor' : 'Agregar Nuevo Doctor'

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      {/* Ruta de navegación */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm">
        <Link to="/doctors" className="text-ink-soft hover:text-brand">
          Doctores
        </Link>
        <Icon name="chevronRight" size={14} />
        <span className="font-semibold text-brand">{title}</span>
      </nav>

      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line bg-canvas px-6 py-5">
          <h1 className="flex items-center gap-2 text-lg font-bold text-ink-strong">
            <Icon name="doctors" size={20} />
            {isEdit ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {isEdit
              ? 'Modifique los datos del profesional.'
              : 'Complete todos los campos obligatorios para integrar al nuevo facultativo al sistema del centro médico.'}
          </p>
        </div>

        <div className="p-6">
          <Alert className="mb-5">{errorMessage}</Alert>

          {isLoading && <p className="text-sm text-ink-soft">Cargando...</p>}

          {!isLoading && (!isEdit || doctor) && (
            <DoctorForm
              defaultValues={defaultValues}
              specialities={specialities}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/doctors')}
              submitLabel={isEdit ? 'Guardar Cambios' : 'Guardar Doctor'}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default DoctorFormPage