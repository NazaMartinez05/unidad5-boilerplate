function Avatar({ initial }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent"
    >
      {initial}
    </span>
  )
}

export default Avatar
