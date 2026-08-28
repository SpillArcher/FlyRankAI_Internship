import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { getFocusableElements } from './focusable'

/**
 * Modal dialog implemented against the W3C ARIA APG "Dialog (Modal)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Behaviour implemented by hand:
 * - role="dialog" + aria-modal="true", labelled by the visible title.
 * - Focus moves into the dialog when it opens (no "obvious default control"
 *   here, so per the pattern focus lands on the dialog container itself).
 * - Focus is trapped: Tab/Shift+Tab cycle only through elements inside the
 *   dialog. Implemented via portal-to-body (so nothing focusable sits after
 *   it in DOM order) plus edge interception on Tab/Shift+Tab, PLUS the
 *   native `inert` attribute on every other body child while open, which
 *   also removes background content from the accessibility tree.
 * - Escape closes the dialog.
 * - Focus returns to the element that opened the dialog when it closes.
 * - Background scroll is locked while open.
 */
interface ModalProps {
  triggerLabel: string
  title: string
  description?: string
  children: ReactNode
}

export function Modal({ triggerLabel, title, description, children }: ModalProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  // Move focus in on open, move it back out on close.
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null
      // No single obvious default control to focus, so focus the dialog
      // container itself per the APG pattern's guidance for that case.
      panelRef.current?.focus()
    } else {
      const toRestore = previouslyFocusedRef.current
      if (toRestore && document.contains(toRestore)) {
        toRestore.focus()
      }
    }
  }, [open])

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  // Hide (and functionally disable) everything else in the page while open.
  useEffect(() => {
    if (!open) return
    const portalNode = panelRef.current?.closest('[data-modal-portal]')
    const siblings = Array.from(document.body.children).filter((el) => el !== portalNode)
    siblings.forEach((el) => el.setAttribute('inert', ''))
    return () => {
      siblings.forEach((el) => el.removeAttribute('inert'))
    }
  }, [open])

  function close() {
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      close()
      return
    }

    if (event.key !== 'Tab' || !panelRef.current) return

    const focusable = getFocusableElements(panelRef.current)
    if (focusable.length === 0) {
      // Nothing to tab to inside the dialog; keep focus put.
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="modal-trigger">
        {triggerLabel}
      </button>
      {open &&
        createPortal(
          <div data-modal-portal="">
            <div className="modal-overlay" onClick={close} />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descriptionId : undefined}
              tabIndex={-1}
              className="modal-panel"
              onKeyDown={handleKeyDown}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id={titleId} className="modal-title">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="modal-description">
                  {description}
                </p>
              )}
              <div className="modal-body">{children}</div>
              <button type="button" className="modal-close" onClick={close}>
                Close
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
