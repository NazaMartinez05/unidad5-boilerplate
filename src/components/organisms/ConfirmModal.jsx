import { useEffect, useRef } from 'react'
import Icon from '../atoms/Icon'

const VARIANTS = {
  danger: {
    icon: 'bg-danger/10 text-danger',
    confirm: 'bg-danger text-white hover:bg-danger/90',
  },
  primary: {
    icon: 'bg-highlight text-brand',
    confirm: 'bg-navy-button text-white hover:bg-navy-button-hover',
  },
}

// Confirmation dialog in place of window.confirm.
// Closes with Escape, the X, "cancelLabel" or a click outside (not while isLoading).
function ConfirmModal({
  isOpen,
  title,
  message,
  children, // optional extra content (e.g. a summary of what is being confirmed)
  confirmLabel = 'Confirmar',
  cancelLabel = 'Volver',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const cancelRef = useRef(null)
  const styles = VARIANTS[variant] ?? VARIANTS.danger

  useEffect(() => {
    if (!isOpen) return
    // The safe option gets the focus, so Enter does not confirm by accident
    cancelRef.current?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape' && !isLoading) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-md rounded-xl bg-surface p-6 shadow-[0_20px_50px_rgba(15,23,42,0.25)]"
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-hover hover:text-ink-strong disabled:cursor-not-allowed"
        >
          <Icon name="close" size={16} strokeWidth={2} />
        </button>

        <div className="flex gap-4">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
            <Icon name="alertTriangle" size={22} strokeWidth={2} />
          </span>
          <div className="min-w-0 pr-6">
            <h2 id="confirm-modal-title" className="text-lg font-bold text-ink-strong">
              {title}
            </h2>
            {message && <p className="mt-1 text-sm text-ink">{message}</p>}
          </div>
        </div>

        {children && <div className="mt-5">{children}</div>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`cursor-pointer rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles.confirm}`}
          >
            {isLoading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
