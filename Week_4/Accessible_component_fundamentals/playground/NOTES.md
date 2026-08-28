# NOTES.md - what shadcn handled that I didn't

## A quick note on how I actually did this

I couldn't run `npx shadcn add dialog tabs` in the sandbox I was building
in - the network policy there blocks `ui.shadcn.com`. So instead of faking
it from memory, I pulled the real `dialog.tsx` and `tabs.tsx` straight from
the shadcn-ui GitHub repo, and installed the actual `radix-ui` package so I
could dig into the real primitive source in `node_modules` instead of
guessing. If you're reading this with normal network access, it's worth
running the real CLI command yourself and diffing it against what's here,
just to be sure nothing drifted.

One thing that became obvious almost immediately: shadcn's `dialog.tsx` and
`tabs.tsx` are barely 150 lines each, and almost none of that is actual
behavior - they're thin, styled wrappers around Radix. So "what did shadcn
handle" is really "what did Radix handle," and the honest answer is: a lot.

## Modal

Here's roughly what I did: portal the dialog to the end of `document.body`,
focus the panel itself when it opens (there wasn't one obvious element to
focus, so I went with what the pattern says to do in that case), trap
Tab/Shift+Tab at the first and last focusable elements, put focus back on
the trigger when it closes, lock the page scroll, and mark everything else
on the page `inert` while it's open.

That last part is the first thing I'd change if I did this again. Radix
doesn't use `inert` at all - it uses a package called `aria-hidden` that
walks up the DOM and marks every sibling `aria-hidden="true"`, with some
reference counting so nested dialogs don't step on each other when
restoring things afterward. `inert` is newer and arguably does more (it
blocks pointer events too, not just hides from AT), but it's still a real
difference I hadn't thought about until I went looking. And weirdly, while
grepping their source for `aria-modal`, I never found it - Radix doesn't
set `aria-modal="true"` on the dialog at all. It leans entirely on hiding
everything else. I'd added `aria-modal="true"` because that's literally
what the APG pattern text says to do, so this was the first spot where
"follow the spec" and "what the most popular implementation actually does"
genuinely diverged.

The focus trap is another one. Mine only steps in at the edges - first
element, last element, wrap around. It works, but it's a pretty blunt
instrument. Radix's `FocusScope` (with `trapped: true`) actively listens
for focus leaving the dialog and pulls it back, using a live list of
tabbable elements that updates as content changes. On top of that they add
invisible sentinel spans at the very start and end of `<body>` as a second
safety net, completely independent of where the dialog actually sits in the
DOM. I hadn't considered needing a second line of defense like that.

Something I didn't even think to build: what happens on close is hardcoded
in my version - focus always goes back to whatever had it before the
dialog opened. Radix instead fires an `onCloseAutoFocus` event you can
cancel and redirect, which matters more than I expected. If a dialog was
opened from a menu item that no longer exists once the menu itself has
closed, you need somewhere else to send focus, and my version has no way to
say that.

And scroll locking - `document.body.style.overflow = 'hidden'` is the
two-second version, but it doesn't account for the scrollbar disappearing
and the page reflowing, and it does nothing for touch/pinch-zoom on mobile.
Radix wraps the overlay in `react-remove-scroll`, which handles both of
those, and even lets you carve out exceptions ("shards") for things that
should keep scrolling, like the dialog's own content.

## Tabs

What I built handles the basics fine: roving tabindex so only the active
tab is a stop in the page's tab order, arrow keys move focus with
wraparound, Home/End jump to the ends, and it's automatic activation -
arrowing to a tab shows its panel immediately.

Two things I flat-out didn't build, rather than built badly: orientation
and RTL. Radix's roving focus group filters which arrow keys do anything
based on orientation (a vertical tablist responds to up/down instead of
left/right) and flips next/previous when `dir="rtl"`. Mine is hardcoded
horizontal, left-to-right, full stop - not a bug so much as a missing
feature axis.

Activation mode is configurable in theirs and not in mine - I only did
automatic. Radix also supports `manual`, where arrowing around just moves
focus and you have to hit Enter or Space to actually select a tab. That
matters when selecting a tab is expensive, like if it kicks off a network
request - exactly the kind of case that doesn't show up until you've
shipped something and it starts feeling slow.

The other one surprised me a bit: I only render the DOM for whichever panel
is currently selected - the rest just return `null`. Radix keeps every
panel mounted the whole time and toggles the `hidden` attribute instead.
Practically, that means switching tabs in my version wipes out anything
panel-local, like scroll position or a half-filled form field, and theirs
doesn't.

## Disclosure

There's honestly not a direct shadcn equivalent to compare against here -
the closest things in their catalog are `Collapsible` (same idea, unstyled)
and `Accordion` (built for a group of these, not just one). So there's
nothing to diff line by line.

But building it taught me something worth writing down anyway: because the
trigger is a real `<button>` and not a styled div, I never had to write a
keydown handler for it. Enter, Space, and Tab focusability all just work,
for free, because the browser already implements that for buttons. That's
kind of the whole point of this pattern - picking the right semantic
element upfront means there's an entire category of accessibility work you
just don't have to do.

## What I'm taking away from this

None of the gaps above are Radix doing something the APG pattern doesn't
call for - they're Radix doing more work to reach the same result the
pattern describes. My components are correct against the spec. Radix's are
correct against the spec *and* hold up under things the spec doesn't really
talk about - nested dialogs, content changing while something's open,
mobile scrolling, RTL layouts. That gap between "technically matches the
spec" and "actually holds up" is the whole reason this exercise mattered -
you can't tell the difference by reading AI-generated component code, only
by having built one yourself first.