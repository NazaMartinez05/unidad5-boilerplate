import { useState } from 'react'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import { addDays, getWeekStart, getWorkWeek, isPastSlot } from '../../../utils/dates'
import DoctorCard from '../components/DoctorCard'
import DoctorSelectionTable from '../components/DoctorSelectionTable'
import SelectedAppointmentBar from '../components/SelectedAppointmentBar'
import WeeklyAvailability from '../components/WeeklyAvailability'
import { DOCTORS_RESPONSE, getDoctorSlots } from '../services/bookingMockData'

const DOCTORS = DOCTORS_RESPONSE.data

function FindDoctorsPage() {
  const currentWeekStart = getWeekStart(new Date())//ref para volver a hoy y bloquear semanas pasadas

  const [selectedDoctorId, setSelectedDoctorId] = useState(null)
  const [isTableOpen, setIsTableOpen] = useState(true)
  const [weekStart, setWeekStart] = useState(currentWeekStart)//guarda el lunes de la semana que se esta viendo
  const [selectedSlot, setSelectedSlot] = useState(null)

  const doctor = DOCTORS.find((item) => item.id === selectedDoctorId)

  // Cuando el usuario elige un doctor en la tabla:
  //1. Guarda su ID.
  //2. Cierra la tabla (isTableOpen = false).
  //3. Reinicia la semana a la actual.
  //4. Limpia el turno seleccionado (si cambia de doctor, no debe quedar un turno del doctor anterior marcado)
  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId)
    setIsTableOpen(false)
    setWeekStart(currentWeekStart)
    setSelectedSlot(null)
  }

  // Para un día dado, obtiene los horarios del doctor y descarta los que ya pasaron
  const getSlots = (day) => getDoctorSlots(doctor.id, day).filter((time) => !isPastSlot(day, time))

  // Acá va la conexion al endpoint para reservar un turno
  const handleConfirm = () => {
    console.log('Confirm appointment', { doctorId: doctor.id, date: selectedSlot.date, time: selectedSlot.time })
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <section className="rounded-lg border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Reservar Turno Médico</h1>
        <p className="mt-1 text-sm text-ink">Seleccione un doctor para ver su disponibilidad.</p>

        {/* Animates the height between full (1fr) and collapsed (0fr) */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isTableOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden" inert={!isTableOpen}>
            <div className="pt-6">
              <DoctorSelectionTable doctors={DOCTORS} selectedDoctorId={selectedDoctorId} onSelect={handleSelectDoctor} />
            </div>
          </div>
        </div>

        {!isTableOpen && ( //si la tabla no esta abierta/desplegada se muestra un boton para seleccionar otro doctor
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" onClick={() => setIsTableOpen(true)}>
              <Icon name="chevronDown" size={16} strokeWidth={2} />
              Seleccionar otro doctor
            </Button>
          </div>
        )}
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

export default FindDoctorsPage
