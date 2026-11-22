import Badge from '../../../components/atoms/Badge'

// Estilo del chip según el estado del turno
const STATUS = {
  confirmed: { label: 'Confirmado', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { label: 'Pendiente', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
}

const EMPTY = '—'

// appointment: { id, speciality, doctorName, date: "YYYY-MM-DD", time: "HH:mm", status }
function AppointmentCard({ appointment, onCancel }) {
  const status = STATUS[appointment.status] ?? STATUS.pending

  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="info">{appointment.speciality ?? 'Turno médico'}</Badge>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.chip}`}>
          <span className={`size-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <h2 className="mt-3 text-lg font-bold text-ink-strong">{appointment.doctorName ?? EMPTY}</h2>

      <p className="mt-1 text-sm text-ink">
        Fecha: <strong className="font-semibold text-ink-strong">{appointment.date ?? EMPTY}</strong>
        {appointment.time && (
          <>
            {' '}a las <strong className="font-semibold text-ink-strong">{appointment.time} hs</strong>
          </>
        )}
      </p>

      <div className="mt-4 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => onCancel(appointment.id)}
          className="w-full cursor-pointer rounded-md border border-line bg-surface py-2 text-xs font-medium text-ink-strong transition-colors hover:border-danger/40 hover:bg-danger/5 hover:text-danger"
        >
          Cancelar Turno
        </button>
      </div>
    </article>
  )
}

export default AppointmentCard
