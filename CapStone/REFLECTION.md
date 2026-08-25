# Reflection - Style Stylist

## What was hardest, and why

One real friction point in the build: the AI integration was originally written for the Claude API, then swapped to Gemini mid-project because that's the key you actually had available to test with. That's a bigger change than it sounds - it's not just a different API endpoint, it's a different approach to getting structured output (Gemini's `responseSchema` versus prompt-only JSON), which meant re-thinking how to guarantee the response could actually be parsed instead of just hoping the model followed instructions.

## What I'd do differently next time

Testing with a real API key happened late - after the code was written and "verified" only by the fact that it compiled. Compiling clean and actually working are different things, and the gap between them wasn't checked until fairly late in the process.

[Is there something you'd sequence differently - write tests earlier, deploy earlier so you catch prod-only bugs sooner, run the accessibility audit before writing so much UI instead of after? Be specific - "test earlier" is the generic version of this answer; naming the actual moment it would've helped is the honest version.]

## One thing that surprised me

The anti-hallucination design - never letting the model supply price, image, or title, only an id and a reason, then validating every id against the real catalog server-side - turned out to matter more than the prompt wording itself. A well-designed constraint on *what the model is trusted to output* did more for reliability than trying to phrase a "perfect" prompt.

[Does that match what actually surprised you, or was it something else - how much the responseSchema feature simplified parsing, how fragile the Platzi category IDs were, something about the accessibility audit results, how long the "boring" parts (README, checklist, tests) took relative to the AI feature itself? Swap this in if so.]
