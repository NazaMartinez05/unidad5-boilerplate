import Icon from '../../../components/atoms/Icon'
import { formatWeekRange, getShortDayName, isSameDay } from '../../../utils/dates'

const arrowButtonClass =
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-ink-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'


function WeeklyAvailability({ weekDays, getSlots, selectedSlot, onSelectSlot, canGoPrev, onPrevWeek, onNextWeek }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Semana anterior" onClick={onPrevWeek} disabled={!canGoPrev} className={arrowButtonClass}>
            <Icon name="chevronLeft" size={18} strokeWidth={2} />
          </button>
          <h2 className="text-lg font-semibold text-ink-strong">{formatWeekRange(weekDays)}</h2>
          <button type="button" aria-label="Semana siguiente" onClick={onNextWeek} className={arrowButtonClass}>
            <Icon name="chevronRight" size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-ink">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-brand" /> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-mint" /> Seleccionado
          </span>
        </div>
      </div>

      {/* On small screens the week scrolls sideways */}
      <div className="overflow-x-auto">
        <div className="grid min-w-160 grid-cols-5 divide-x divide-line">
          {weekDays.map((day) => {
            const slots = getSlots(day)

            return (
              <div key={day.toDateString()} className={`flex flex-col ${slots.length === 0 ? 'bg-canvas' : ''}`}>
                <div className="py-3 text-center">
                  <p className="text-xs text-ink">{getShortDayName(day)}</p>
                  <p className="text-lg font-semibold text-ink-strong">{day.getDate()}</p>
                </div>

                <div className="flex min-h-48 flex-1 flex-col gap-2 p-3">
                  {slots.length === 0 ? (
                    <p className="m-auto max-w-36 text-center text-sm text-ink">
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
                          className={`cursor-pointer rounded-md border py-1.5 text-sm font-semibold transition-colors ${
                            isSelected
                              ? 'border-mint bg-mint text-ink-strong'
                              : 'border-field-line bg-field text-brand hover:border-brand'
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
    </section>
  )
}

export default WeeklyAvailability
