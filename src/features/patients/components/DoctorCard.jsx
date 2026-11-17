import Badge from '../../../components/atoms/Badge'
import ProfileImage from '../../../components/atoms/ProfileImage'

function DoctorCard({ doctor }) {
  return (
    <article className="flex items-center gap-5 overflow-hidden rounded-lg border border-line bg-surface">
      <ProfileImage name={doctor?.name} className="size-24 text-2xl" />
      <div className="py-4 pr-4">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-brand">{doctor?.name}</h2>
          <Badge variant="info">{doctor?.speciality?.name}</Badge>
        </div>
        <p className="text-sm text-ink">Matrícula: {doctor?.licenseNumber}</p>
      </div>
    </article>
  )
}

export default DoctorCard