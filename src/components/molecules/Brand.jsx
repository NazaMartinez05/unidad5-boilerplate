import Logo from '../atoms/Logo'

function Brand({ name, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 px-2 pb-5.5">
      <Logo />
      <div className="flex flex-col leading-tight">
        <span className="text-[14.5px] font-semibold text-ink-strong">{name}</span>
        <span className="text-[11.5px] text-ink-soft">{subtitle}</span>
      </div>
    </div>
  )
}

export default Brand
