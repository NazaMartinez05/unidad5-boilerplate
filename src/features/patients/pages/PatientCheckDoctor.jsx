import { useMemo, useState } from 'react'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import FormField from '../../../components/molecules/FormField'
import DoctorCard from '../components/DoctorCard'
import SelectedAppointmentBar from '../components/SelectedAppointmentBar'
import WeeklyAvailability from '../components/WeeklyAvailability'
import Select from '../../../components/atoms/Select'
import { getWeekStart } from '../../../utils/dates'


function PatientCheckDoctor({ doctors = [], onSearch }) {
  const currentWeekStart = getWeekStart(new Date())//ref para volver a hoy y bloquear semanas pasadas
  const [weekStart, setWeekStart] = useState(currentWeekStart)//guarda el lunes de la semana que se esta viendo
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [specialityId, setSpecialityId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [doctor, setDoctor] = useState(null);

  // Especialidades únicas, sacadas de los doctores
  const specialityOptions = useMemo(() => {
    const map = new Map()
    doctors.forEach((d) => {
      if (d.speciality) map.set(String(d.speciality.id), d.speciality.name)
    })
    return [
      { value: '', label: 'Seleccione una especialidad' },
      ...[...map].map(([value, label]) => ({ value, label })),
    ]
  }, [doctors])

  // Doctores activos de la especialidad elegida
  const doctorOptions = useMemo(
    () => [
      { value: '', label: 'Seleccione un doctor' },
      ...doctors
        .filter((d) => d.isActive && String(d.speciality?.id) === specialityId)
        .map((d) => ({ value: String(d.id), label: d.name })),
    ],
    [doctors, specialityId],
  )

  const handleSpecialityChange = (e) => {
    setSpecialityId(e.target.value)
    setDoctorId('') // al cambiar de especialidad, se limpia el doctor
  }

  const handleSearch = () => {
    const doctor = doctors.find((d) => String(d.id) === doctorId)
    if (doctor) onSearch(doctor)
  }

  // Para un día dado, obtiene los horarios del doctor y descarta los que ya pasaron
  const getSlots = (day) => getDoctorSlots(doctor.id, day).filter((time) => !isPastSlot(day, time))

  // Acá va la conexion al endpoint para reservar un turno
  const handleConfirm = () => {
    console.log('Confirm appointment', { doctorId: doctor.id, date: selectedSlot.date, time: selectedSlot.time })
  }

  return (
    <div className="min-h-screen bg-portal">
    <section className="rounded-lg border border-field-line bg-surface p-6 sm:p-8">
    <h1 className="mb-6 text-2xl font-bold text-brand sm:text-3xl">Reservar Turno Médico</h1>
    <div className="grid items gap-4 md:grid-cols-[1fr_1fr_auto]">
    
      <FormField label="Seleccionar Especialidad" htmlFor="speciality">
        <Select
          id="speciality"
          value={specialityId}
          onChange={handleSpecialityChange}
          options={specialityOptions}
        />
      </FormField>

      <FormField label="Seleccionar Doctor" htmlFor="doctor">
        <Select
          id="doctor"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          options={doctorOptions}
          disabled={!specialityId}
        />
      </FormField>

      <Button onClick={handleSearch} disabled={!doctorId}>
        <Icon name="search" size={16} strokeWidth={2} />
        Buscar Disponibilidad
      </Button>
    </div>
    </section>

    {doctor && ( //se muestra solo cuando se seleccione un doctor 
        <>
          <DoctorCard doctor={doctor} />

          <WeeklyAvailability
            weekDays={getWorkWeek(weekStart)}
            getSlots={getSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            canGoPrev={weekStart > currentWeekStart}
            onPrevWeek={() => setWeekStart(addDays(weekStart, -7))}
            onNextWeek={() => setWeekStart(addDays(weekStart, 7))}
          />

          <SelectedAppointmentBar doctor={doctor} slot={selectedSlot} onConfirm={handleConfirm} />
        </>
      )}
    </div>
    
  )
}

export default PatientCheckDoctor
