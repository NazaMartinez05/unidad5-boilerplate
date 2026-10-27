import Avatar from '../atoms/Avatar'

function UserCard({ name, role }) {
  return (
    <div className="mt-1.5 flex items-center gap-2.5 px-2 pt-3 pb-1">
      <Avatar initial={name.charAt(0)} />
      <div className="flex flex-col leading-tight">
        <span className="text-[13px] font-semibold text-ink-strong">{name}</span>
        <span className="text-[11px] text-ink-soft">{role}</span>
      </div>
    </div>
  )
}

export default UserCard
