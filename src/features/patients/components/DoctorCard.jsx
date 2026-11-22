import Badge from '../../../components/atoms/Badge'
import Icon from '../../../components/atoms/Icon'

// Doctor summary shown above the weekly availability.
// doctor: { name, licenseNumber, isActive, speciality: { name } } (GET /api/doctors/allDoctors)
function DoctorCard({ doctor }) {
  return (
    <article className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-4 md:rounded-lg md:px-5">
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
        {/* Mobile: speciality in small caps, like the design */}
        <p className="text-xs font-bold tracking-wide text-brand uppercase md:text-sm md:font-semibold md:tracking-normal md:text-ink md:normal-case">
          {doctor?.speciality?.name}
        </p>
        {doctor?.licenseNumber && <p className="truncate text-xs text-ink-soft">Matrícula N° {doctor.licenseNumber}</p>}
      </div>
    </article>
  )
}

export default DoctorCard