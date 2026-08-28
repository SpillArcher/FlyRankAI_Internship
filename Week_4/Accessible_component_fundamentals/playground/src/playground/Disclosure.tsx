import { useId, useState, type ReactNode } from 'react'

/**
 * Disclosure implemented against the W3C ARIA APG "Disclosure (Show/Hide)"
 * pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Behaviour implemented by hand:
 * - A real <button> (not a styled <div>) controlling a content region, with
 *   aria-expanded reflecting open/closed state and aria-controls pointing
 *   at the region's id.
 * - Because it's a native button, Enter and Space activation and Tab
 *   focusability come for free from the browser — there is no custom
 *   keydown handler here, which is deliberate: reaching for a semantic
 *   element instead of a div removed an entire category of work.
 * - The collapsed content is removed from the tab order and the
 *   accessibility tree via the `hidden` attribute rather than just being
 *   visually hidden with CSS, so a Tab press can't land inside content the
 *   user can't see.
 */
interface DisclosureProps {
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className="disclosure">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        className="disclosure-trigger"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="disclosure-icon" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
        {summary}
      </button>
      <div id={contentId} role="region" hidden={!open} className="disclosure-content">
        {children}
      </div>
    </div>
  )
}
