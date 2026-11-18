import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import { formatLongDate, minutesBetween } from '../../../utils/dates'

// slot: { date: Date, time: "HH:mm" } or null. endTime: "HH:mm" of the slot (optional).
function SelectedAppointmentBar({ slot, endTime, isConfirming = false, onConfirm }) {
  const duration = slot && endTime ? minutesBetween(slot.time, endTime) : null

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-highlight-line bg-highlight px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="border-l-4 border-brand pl-4">
        <p className="mb-1 text-[11px] font-semibold tracking-wide text-ink uppercase">Resumen de selección</p>
        {slot ? (
          <>
            <p className="flex items-center gap-2 text-lg font-bold text-ink-strong">
              <Icon name="calendar" size={18} />
              {formatLongDate(slot.date, { withYear: true })}, {slot.time} HS
            </p>
            {duration > 0 && <p className="text-xs text-ink-soft">Duración: {duration} min</p>}
          </>
        ) : (
          <p className="text-sm text-ink">Seleccione un horario disponible en el calendario.</p>
        )}
      </div>

      <Button onClick={onConfirm} disabled={!slot || isConfirming} className="px-8 sm:text-base">
        {isConfirming ? 'Confirmando...' : 'Confirmar Turno'}
        {!isConfirming && <Icon name="checkCircle" size={18} strokeWidth={2} />}
      </Button>
    </section>
  )
}

export default SelectedAppointmentBar