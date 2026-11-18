import Badge from '../../../components/atoms/Badge'
import Icon from '../../../components/atoms/Icon'

// Doctor summary shown above the weekly availability.
// doctor: { name, licenseNumber, isActive, speciality: { name } } (GET /api/doctors/allDoctors)
function DoctorCard({ doctor }) {
  return (
    <article className="flex items-center gap-4 rounded-lg border border-line bg-surface px-5 py-4">
      <div className="relative shrink-0">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-xl bg-highlight text-brand"
        >
          <Icon name="stethoscope" size={28} />
        </span>
        {doctor?.isActive && (
          <span
            title="Disponible"
            className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-surface bg-online"
          />
        )}
      </div>

      <div className="min-w-0">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-brand">{doctor?.name}</h2>
          {doctor?.isActive && <Badge variant="info">Verificado</Badge>}
        </div>
        <p className="text-sm font-semibold text-ink">{doctor?.speciality?.name}</p>
        {doctor?.licenseNumber && <p className="text-xs text-ink-soft">Matrícula N° {doctor.licenseNumber}</p>}
      </div>
    </article>
  )
}

export default DoctorCard