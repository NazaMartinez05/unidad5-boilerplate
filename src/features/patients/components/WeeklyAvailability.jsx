import Icon from '../../../components/atoms/Icon'
import { formatWeekRange, getShortDayName, isSameDay } from '../../../utils/dates'

const arrowButtonClass =
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-line text-ink-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

// getSlots(day) -> ["HH:mm", ...] free times of that day
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
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Semana anterior" onClick={onPrevWeek} disabled={!canGoPrev} className={arrowButtonClass}>
            <Icon name="chevronLeft" size={16} strokeWidth={2} />
          </button>
          <h2 className="text-lg font-semibold text-ink-strong">{formatWeekRange(weekDays)}</h2>
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
        /* On small screens the week scrolls sideways */
        <div className="overflow-x-auto">
          <div className="grid min-w-160 grid-cols-5 gap-4 p-5">
            {weekDays.map((day) => {
              const slots = getSlots(day)

              return (
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
                        const isSelected = selectedSlot && isSameDay(selectedSlot.date, day) && selectedSlot.time === time

                        return (
                          <button
                            key={time}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onSelectSlot({ date: day, time })}
                            className={`cursor-pointer rounded-md border py-2 text-sm font-semibold transition-colors ${
                              isSelected
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
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default WeeklyAvailability