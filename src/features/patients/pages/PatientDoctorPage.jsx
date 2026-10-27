import { useState, useEffect } from 'react'
import { getDoctor } from '../services/patientService'
import { getDoctorSlots } from '../services/patientService'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import { addDays, getWeekStart, getWorkWeek, isPastSlot } from '../../../utils/dates'
import DoctorCard from '../components/DoctorCard'
import DoctorSelectionTable from '../components/DoctorSelectionTable'
import SelectedAppointmentBar from '../components/SelectedAppointmentBar'
import WeeklyAvailability from '../components/WeeklyAvailability'

function PatientDoctorPage() {
  const currentWeekStart = getWeekStart(new Date())

  const [selectedDoctorId, setSelectedDoctorId] = useState(null)
  const [isTableOpen, setIsTableOpen] = useState(true)
  const [weekStart, setWeekStart] = useState(currentWeekStart)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [doctors, setDoctors] = useState(null)
  const [doctor, setDoctor] = useState(null)

  const handleGetDoctor = async (page) => {
    const doctors = await getDoctor(4, page);
    setDoctors(doctors);
  }

  useEffect(() => {
    handleGetDoctor(1)
  }, [])

  //al seleccionar un doctor la busqueda comienza de cero
  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId)
    setIsTableOpen(false)
    setWeekStart(currentWeekStart)
    setSelectedSlot(null)
    const doctor = doctors.find((item) => item.id === doctorId)
    setDoctor(doctor)
  }

  //horarios vencidos no estan disponibles
  const getSlots = (day) => getDoctorSlots(doctors.id, day).filter((time) => !isPastSlot(day, time))

  const handleConfirm = () => {
    console.log('Confirm appointment', { doctorId: doctors.id, date: selectedSlot.date, time: selectedSlot.time })
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <section className="rounded-lg border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Reservar Turno Médico</h1>
        <p className="mt-1 text-sm text-ink">Seleccione un doctor para ver su disponibilidad.</p>

        //La tabla se minimiza una vez que se selecciona un doctor
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isTableOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
        >
          <div className="overflow-hidden" inert={!isTableOpen}>
            <div className="pt-6">
              <DoctorSelectionTable doctors={doctors} selectedDoctorId={selectedDoctorId} onSelect={handleSelectDoctor} />
            </div>
          </div>
        </div>

        //tambien se puede desplegar de nuevo para cambiar la eleccion
        {!isTableOpen && (
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" onClick={() => setIsTableOpen(true)}>
              <Icon name="chevronDown" size={16} strokeWidth={2} />
              Seleccionar otro doctor
            </Button>
          </div>
        )}
      </section>

        //Mostramos el doctor seleccionado
      {doctor && (
        <>
          <DoctorCard doctor={doctor} />
            //Disponibilidad del doctor seleccionado
          <WeeklyAvailability
            weekDays={getWorkWeek(weekStart)}
            getSlots={getSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            canGoPrev={weekStart > currentWeekStart}
            onPrevWeek={() => setWeekStart(addDays(weekStart, -7))}
            onNextWeek={() => setWeekStart(addDays(weekStart, 7))}
          />

          <SelectedAppointmentBar doctors={doctor} slot={selectedSlot} onConfirm={handleConfirm} />
        </>
      )}
    </div>
  )
}

export default PatientDoctorPage