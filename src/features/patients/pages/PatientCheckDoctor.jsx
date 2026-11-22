import Alert from '../../../components/atoms/Alert'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import Select from '../../../components/atoms/Select'
import FormField from '../../../components/molecules/FormField'
import { useAuth } from '../../auth/hooks/useAuth'
import DoctorCard from '../components/DoctorCard'
import SelectedAppointmentBar from '../components/SelectedAppointmentBar'
import WeeklyAvailability from '../components/WeeklyAvailability'
import { useBooking } from '../hooks/useBooking'

// "Reservar Turno": the data flow lives in useBooking; this page renders
function PatientCheckDoctor() {
  const { dni } = useAuth()
  const booking = useBooking(dni)

  const specialityOptions = [
    { value: '', label: 'Seleccione una especialidad' },
    ...booking.specialities.map((s) => ({ value: s.id, label: s.name })),
  ]
  const doctorOptions = [
    { value: '', label: 'Seleccione un doctor' },
    ...booking.specialityDoctors.map((d) => ({ value: d.id, label: d.name })),
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-5">
      <section className="rounded-xl border border-field-line bg-surface p-5 sm:p-8 md:rounded-lg">
        <h1 className="text-2xl font-bold text-brand sm:text-3xl">Reservar Turno Médico</h1>
        <p className="mt-1 mb-5 text-sm text-ink md:mb-6">Seleccione la especialidad y el profesional para continuar.</p>

        <div className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]">
          <FormField label="Seleccionar Especialidad" htmlFor="speciality">
            <Select
              id="speciality"
              value={booking.specialityId}
              onChange={(e) => booking.selectSpeciality(e.target.value)}
              options={specialityOptions}
            />
          </FormField>

          <FormField label="Seleccionar Doctor" htmlFor="doctor">
            <Select
              id="doctor"
              value={booking.doctorId}
              onChange={(e) => booking.selectDoctor(e.target.value)}
              options={doctorOptions}
              disabled={!booking.specialityId}
            />
          </FormField>

          <Button onClick={booking.searchAvailability} disabled={!booking.doctorId} className="w-full py-2.5 md:w-auto">
            <Icon name="search" size={16} strokeWidth={2} />
            Buscar Disponibilidad
          </Button>
        </div>
      </section>

      <Alert className="px-4 py-3">{booking.errorMessage}</Alert>
      <Alert variant="success" className="px-4 py-3">
        {booking.successMessage}
      </Alert>

      {booking.doctor && ( //se muestra solo cuando se seleccione un doctor
        <>
          <DoctorCard doctor={booking.doctor} />

          <WeeklyAvailability
            weekDays={booking.weekDays}
            getSlots={booking.getSlots}
            isLoading={booking.isLoadingSlots}
            selectedSlot={booking.selectedSlot}
            onSelectSlot={booking.selectSlot}
            canGoPrev={booking.canGoPrev}
            onPrevWeek={booking.prevWeek}
            onNextWeek={booking.nextWeek}
          />

          <SelectedAppointmentBar
            slot={booking.selectedAvailability ? booking.selectedSlot : null}
            endTime={booking.selectedAvailability?.endTime}
            isConfirming={booking.isConfirming}
            onConfirm={booking.confirm}
          />
        </>
      )}
    </div>
  )
}

export default PatientCheckDoctor
