function getInitials(name) {
  return name
    ?.split(' ')
    ?.filter((word) => !/^dra?\.$/i.test(word))
    ?.slice(0, 2)
    ?.map((word) => word.charAt(0))
    ?.join('')
    ?.toUpperCase()
}


function ProfileImage({ src, name, className = '' }) {
  if (src) {
    return <img src={src} alt={name} className={`shrink-0 object-cover object-top ${className}`} />
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={`flex shrink-0 items-center justify-center bg-accent-soft font-semibold text-accent ${className}`}
    >
      {getInitials(name)}
    </span>
  )
}

export default ProfileImage