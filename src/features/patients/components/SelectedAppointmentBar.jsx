import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import { formatLongDate } from '../../../utils/dates'


function SelectedAppointmentBar({ doctor, slot, onConfirm }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-highlight-line bg-highlight px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-ink uppercase">Turno seleccionado</p>
        {slot ? (
          <>
            <p className="flex items-center gap-2 text-lg font-semibold text-ink-strong">
              <Icon name="calendar" size={18} />
              {formatLongDate(slot.date)}, {slot.time} HS
            </p>
            <p className="text-sm text-ink">
              {doctor.name} • {doctor.speciality.name}
            </p>
          </>
        ) : (
          <p className="text-sm text-ink">Seleccione un horario disponible en el calendario.</p>
        )}
      </div>

      <Button onClick={onConfirm} disabled={!slot} className="px-8 sm:text-base">
        Confirmar Turno
        <Icon name="checkCircle" size={18} strokeWidth={2} />
      </Button>
    </section>
  )
}

export default SelectedAppointmentBar
