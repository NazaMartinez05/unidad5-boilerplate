import { useForm, useWatch } from 'react-hook-form'
//import Badge from '../../../components/atoms/Badge'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
//import Select from '../../../components/atoms/Select'
import TextInput from '../../../components/atoms/TextInput'
import FormField from '../../../components/molecules/FormField'
//import { formatShortDate } from '../../../utils/dates'

// One chip per filter in use, shown under the form
function getFilterChips(filters, specialities, doctors) {
  const chips = []
  if (filters.patient.trim()) {
    chips.push(`Paciente: ${filters.patient.trim()}`)
  }
  if (filters.specialityId) {
    const speciality = specialities.find((item) => item.specialityId === filters.specialityId)
    chips.push(`Especialidad: ${speciality.name}`)
  }
  if (filters.doctorId) {
    const doctor = doctors.find((item) => item.doctorId === filters.doctorId)
    chips.push(`Doctor: ${doctor.name}`)
  }
 /*  if (filters.date) {
    chips.push(`Fecha: ${formatShortDate(filters.date)}`)
  } */
  return chips
}

// appliedFilters: the filters the table is using right now
function AppointmentFilters({ specialities, doctors, appliedFilters, lastUpdate, onApply }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: appliedFilters })

  // The doctor combo only lists the doctors of the chosen specialty
  const specialityId = useWatch({ control, name: 'specialityId' })
  const specialityDoctors = specialityId
    ? doctors.filter((doctor) => doctor.speciality.specialityId === specialityId)
    : doctors

  const specialityOptions = [
    { value: '', label: 'Todas las especialidades' },
    ...specialities.map((speciality) => ({ value: speciality.specialityId, label: speciality.name })),
  ]
  const doctorOptions = [
    { value: '', label: 'Todos los doctores' },
    ...specialityDoctors.map((doctor) => ({ value: doctor.doctorId, label: doctor.name })),
  ]

  const chips = getFilterChips(appliedFilters, specialities, doctors)

  return (
    <section className="rounded-lg border border-line bg-surface p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-brand">Criterios de Búsqueda</h2>
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <Icon name="refresh" size={14} />
          Última actualización: {lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} HS
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onApply)}
        noValidate
        className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
      >
        <FormField label="Nombre o DNI del Paciente" htmlFor="patient" error={errors.patient?.message}>
          <TextInput
            id="patient"
            icon="search"
            placeholder="Ej: Juan Pérez o 40123456"
            hasError={!!errors.patient}
            {...register('patient', {
              minLength: { value: 3, message: 'Ingrese al menos 3 caracteres' },
            })}
          />
        </FormField>

        <FormField label="Especialidad" htmlFor="specialityId">
          {/* <Select
            id="specialityId"
            options={specialityOptions}
            // A new specialty may not include the chosen doctor, so we clear it
            {...register('specialityId', { onChange: () => setValue('doctorId', '') })}
          /> */}
        </FormField>

        <FormField label="Doctor" htmlFor="doctorId">
         {/*  <Select id="doctorId" options={doctorOptions} {...register('doctorId')} /> */}
        </FormField>

        <FormField label="Fecha" htmlFor="date">
          <TextInput id="date" type="date" {...register('date')} />
        </FormField>

        {/* xl:mt-5.5 lines the button up with the inputs (below the labels) */}
        <Button type="submit" className="sm:col-span-2 xl:col-span-1 xl:mt-5.5 xl:py-2.5">
          <Icon name="filter" size={16} strokeWidth={2} />
          Aplicar Filtros
        </Button>
      </form>

      {/* <div className="mt-4 flex flex-wrap gap-2">
        {chips.length > 0 ? (
          chips.map((chip) => (
            <Badge key={chip} variant="info">
              {chip}
            </Badge>
          ))
        ) : (
          <Badge variant="success" withDot>
            Sin filtros: se muestran todas las citas
          </Badge>
        )}
      </div> */}
    </section>
  )
}

export default AppointmentFilters
