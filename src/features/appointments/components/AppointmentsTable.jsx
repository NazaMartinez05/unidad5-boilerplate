import Badge from '../../../components/atoms/Badge'
import Icon from '../../../components/atoms/Icon'
import Pagination from '../../../components/molecules/Pagination'
import { formatShortDate } from '../../../utils/dates'

// Backend AppointmentStatus enum -> what we show in "Estado"
const STATUSES = {
  Booked: { label: 'Confirmado', variant: 'success' },
  Attended: { label: 'Completado', variant: 'neutral' },
  Cancelled: { label: 'Cancelado', variant: 'danger' },
  NoShow: { label: 'Ausente', variant: 'danger' },
}

// appointments: only the ones of the current page. total: all the filtered ones.
function AppointmentsTable({ appointments, total, page, totalPages, onPageChange }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <h2 className="px-6 py-5 text-lg font-semibold text-brand">Registros de Citas</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left">
          <thead className="border-y border-highlight-line bg-highlight text-[11px] font-semibold tracking-wide text-ink-strong uppercase">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Especialidad</th>
              <th className="px-6 py-3">Paciente</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {appointments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-ink-soft">
                  No se encontraron citas con los filtros aplicados.
                </td>
              </tr>
            )}

            {appointments.map((appointment) => {
              const status = STATUSES[appointment.status]

              return (
                <tr key={appointment.appointmentId} className="transition-colors hover:bg-canvas">
                  <td className="px-6 py-3">
                    <p className="text-sm font-semibold text-ink-strong">{formatShortDate(appointment.date)}</p>
                    {/* startTime comes as "HH:mm:ss" */}
                    <p className="text-xs text-ink-soft">{appointment.startTime.slice(0, 5)} HS</p>
                  </td>

                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-md bg-highlight text-brand">
                        <Icon name="stethoscope" size={16} />
                      </span>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-ink-strong">{appointment.doctor.speciality.name}</p>
                        <p className="text-xs text-ink-soft">{appointment.doctor.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3">
                    <p className="text-sm font-semibold text-ink-strong">{appointment.patient.fullName}</p>
                    <p className="text-xs text-ink-soft">DNI: {appointment.patient.dni.toLocaleString('es-AR')}</p>
                  </td>

                  <td className="px-6 py-3">
                    <Badge variant={status.variant} withDot>
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-highlight-line bg-highlight px-6 py-3">
        <p className="text-xs text-ink">
          Mostrando {appointments.length} de {total} registros
        </p>
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </section>
  )
}

export default AppointmentsTable
