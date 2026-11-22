import { useState } from 'react'
import Icon from '../../../components/atoms/Icon'
import { formatWeekRange, getShortDayName, isSameDay } from '../../../utils/dates'

const arrowButtonClass =
  'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line text-ink-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

// "NOV"
const getShortMonth = (date) => date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '').toUpperCase()

// getSlots(day) -> ["HH:mm", ...] free times of that day
// Desktop (md+): one column per day. Mobile: a row of day chips and the times
// of the chosen day below.
function WeeklyAvailability({
  weekDays,
  getSlots,
  isLoading = false,
  selectedSlot,
  onSelectSlot,
  canGoPrev,
  onPrevWeek,
  onNextWeek,
}) {
  // Mobile only: the day whose times are listed
  const [activeDayKey, setActiveDayKey] = useState(null)

  const slotsByDay = weekDays.map((day) => ({ day, slots: isLoading ? [] : getSlots(day) }))
  const isSelected = (day, time) => Boolean(selectedSlot && isSameDay(selectedSlot.date, day) && selectedSlot.time === time)

  // Chosen chip if it belongs to this week; else the day of the selected slot,
  // else the first day with free times, else Monday
  const activeDay =
    slotsByDay.find(({ day }) => day.toDateString() === activeDayKey)?.day ??
    slotsByDay.find(({ day }) => selectedSlot && isSameDay(selectedSlot.date, day))?.day ??
    slotsByDay.find(({ slots }) => slots.length > 0)?.day ??
    weekDays[0]
  const activeSlots = slotsByDay.find(({ day }) => isSameDay(day, activeDay))?.slots ?? []

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line py-4 md:mx-5">
        <div className="flex items-center gap-2 md:gap-3">
          <button type="button" aria-label="Semana anterior" onClick={onPrevWeek} disabled={!canGoPrev} className={arrowButtonClass}>
            <Icon name="chevronLeft" size={16} strokeWidth={2} />
          </button>
          <h2 className="text-base font-semibold text-ink-strong md:text-lg">{formatWeekRange(weekDays)}</h2>
          <button type="button" aria-label="Semana siguiente" onClick={onNextWeek} className={arrowButtonClass}>
            <Icon name="chevronRight" size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-ink">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-ink-strong" /> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-mint" /> Seleccionado
          </span>
        </div>
      </div>

      {isLoading ? (
        <p className="px-5 py-16 text-center text-sm text-ink-soft">Cargando disponibilidad...</p>
      ) : (
        <>
          {/* ===== Mobile ===== */}
          <div className="flex flex-col gap-5 p-4 md:hidden">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink-strong">Próximos Turnos</h3>
                <button
                  type="button"
                  onClick={onNextWeek}
                  className="flex cursor-pointer items-center gap-0.5 text-sm font-semibold text-brand hover:underline"
                >
                  Ver más <Icon name="chevronRight" size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                {slotsByDay.map(({ day, slots }) => {
                  const isActive = isSameDay(day, activeDay)
                  return (
                    <button
                      key={day.toDateString()}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveDayKey(day.toDateString())}
                      className={`flex w-16 shrink-0 cursor-pointer flex-col items-center rounded-lg border py-2.5 transition-colors ${
                        isActive
                          ? 'border-navy-button bg-navy-button text-white'
                          : `border-line bg-surface text-ink-strong hover:border-brand ${slots.length === 0 ? 'opacity-50' : ''}`
                      }`}
                    >
                      <span className={`text-[11px] font-semibold ${isActive ? 'text-white/80' : 'text-ink-soft'}`}>
                        {getShortDayName(day)}
                      </span>
                      <span className="text-xl leading-tight font-bold">{day.getDate()}</span>
                      <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-ink-soft'}`}>{getShortMonth(day)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold text-ink-strong">Horarios disponibles (Bloques de 30 min)</h3>
              {activeSlots.length === 0 ? (
                <p className="rounded-md bg-canvas px-4 py-6 text-center text-xs text-ink-soft">
                  No hay turnos disponibles para este día.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {activeSlots.map((time) => {
                    const selected = isSelected(activeDay, time)
                    return (
                      <button
                        key={time}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelectSlot({ date: activeDay, time })}
                        className={`cursor-pointer rounded-md border py-2 text-sm font-semibold transition-colors ${
                          selected
                            ? 'border-2 border-navy-button bg-surface text-navy-button'
                            : 'border-line bg-surface text-ink-strong hover:border-brand'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ===== Desktop ===== */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 gap-4 p-5">
              {slotsByDay.map(({ day, slots }) => (
                <div key={day.toDateString()} className="flex flex-col">
                  <div className="pb-3 text-center">
                    <p className="text-xs font-semibold text-ink-soft">{getShortDayName(day)}</p>
                    <p className="text-xl font-bold text-ink-strong">{day.getDate()}</p>
                  </div>

                  <div className="flex min-h-48 flex-1 flex-col gap-2.5">
                    {slots.length === 0 ? (
                      <p className="m-auto max-w-36 text-center text-xs text-ink-soft">
                        No hay turnos disponibles para este día.
                      </p>
                    ) : (
                      slots.map((time) => {
                        const selected = isSelected(day, time)
                        return (
                          <button
                            key={time}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onSelectSlot({ date: day, time })}
                            className={`cursor-pointer rounded-md border py-2 text-sm font-semibold transition-colors ${
                              selected
                                ? 'border-mint bg-mint text-white'
                                : 'border-line bg-surface text-ink-strong hover:border-brand'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default WeeklyAvailability
