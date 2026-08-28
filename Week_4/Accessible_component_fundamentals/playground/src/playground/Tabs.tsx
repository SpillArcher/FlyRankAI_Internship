import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

/**
 * Tabs implemented against the W3C ARIA APG "Tabs" pattern (automatic
 * activation variant): https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Behaviour implemented by hand:
 * - role="tablist" containing role="tab" buttons, each aria-controls-ing a
 *   role="tabpanel".
 * - Roving tabindex: only the selected tab is in the page Tab order
 *   (tabIndex 0); the rest are -1. Tab therefore moves focus into/out of
 *   the whole tablist as a single stop, not tab-by-tab.
 * - ArrowLeft/ArrowRight move focus between tabs with wraparound, and
 *   (automatic activation) immediately select + show that tab's panel.
 * - Home/End jump to the first/last tab.
 * - The active tabpanel is focusable (tabIndex 0) so a keyboard user who
 *   tabs out of the tablist lands in content even if that content has no
 *   focusable elements of its own.
 */
interface TabItem {
  id: string
  label: string
  panel: ReactNode
}

interface TabsProps {
  label: string
  items: TabItem[]
}

export function Tabs({ label, items }: TabsProps) {
  const baseId = useId()
  const [selectedId, setSelectedId] = useState(items[0]?.id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function selectByIndex(index: number) {
    const item = items[index]
    if (!item) return
    setSelectedId(item.id)
    tabRefs.current[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        selectByIndex((index + 1) % items.length)
        break
      case 'ArrowLeft':
        event.preventDefault()
        selectByIndex((index - 1 + items.length) % items.length)
        break
      case 'Home':
        event.preventDefault()
        selectByIndex(0)
        break
      case 'End':
        event.preventDefault()
        selectByIndex(items.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs-list">
        {items.map((item, index) => {
          const selected = item.id === selectedId
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className="tabs-tab"
              onClick={() => setSelectedId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => {
        const selected = item.id === selectedId
        if (!selected) return null
        return (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            tabIndex={0}
            className="tabs-panel"
          >
            {item.panel}
          </div>
        )
      })}
    </div>
  )
}
