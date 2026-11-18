import Button from '../../../components/atoms/Button'
import Badge from '../../../components/atoms/Badge'

// Estilo del chip según el estado del turno
const STATUS = {
  confirmed: { label: 'Confirmado', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { label: 'Pendiente', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
}

function AppointmentCard({ appointment, onCancel }) {
  const status = STATUS[appointment.status] ?? STATUS.pending

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="info">{appointment.speciality}</Badge>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.chip}`}>
          <span className={`size-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <h2 className="text-base font-bold text-ink-strong">{appointment.doctorName}</h2>

      <p className="text-sm text-ink">
        Fecha: <strong className="text-ink-strong">{appointment.date}</strong> a las{' '}
        <strong className="text-ink-strong">{appointment.time} hs</strong>
      </p>

      <div className="border-t border-line pt-4">
        <Button variant="secondary" className="w-full" onClick={() => onCancel(appointment.id)}>
          Cancelar Turno
        </Button>
      </div>
    </article>
  )
}

export default AppointmentCard