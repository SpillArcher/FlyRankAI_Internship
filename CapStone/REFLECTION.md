# Reflection - Style Stylist

> This is a **draft starting point**, not your finished reflection. I pulled the raw material from what actually happened in your build (the provider swap, the env file confusion, the anti-hallucination decision) - but "hardest" and "surprising" are about your actual experience, not mine. Read each section, keep what's true, cut or rewrite what isn't. A generic-sounding reflection is exactly what this rubric is checking for, so the more specific you make this to what you actually struggled with, the better it'll read.

## What was hardest, and why

One real friction point in the build: the AI integration was originally written for the Claude API, then swapped to Gemini mid-project because that's the key you actually had available to test with. That's a bigger change than it sounds - it's not just a different API endpoint, it's a different approach to getting structured output (Gemini's `responseSchema` versus prompt-only JSON), which meant re-thinking how to guarantee the response could actually be parsed instead of just hoping the model followed instructions.

[Was this actually the hardest part for you, or was it something else - the Platzi API filtering, getting the anti-hallucination lookup right, the deployment/env-variable setup, something in testing or the audit? Replace this if it's not accurate.]

## What I'd do differently next time

Testing with a real API key happened late - after the code was written and "verified" only by the fact that it compiled. Compiling clean and actually working are different things, and the gap between them wasn't checked until fairly late in the process.

[Is there something you'd sequence differently - write tests earlier, deploy earlier so you catch prod-only bugs sooner, run the accessibility audit before writing so much UI instead of after? Be specific - "test earlier" is the generic version of this answer; naming the actual moment it would've helped is the honest version.]

## One thing that surprised me

The anti-hallucination design - never letting the model supply price, image, or title, only an id and a reason, then validating every id against the real catalog server-side - turned out to matter more than the prompt wording itself. A well-designed constraint on *what the model is trusted to output* did more for reliability than trying to phrase a "perfect" prompt.

[Does that match what actually surprised you, or was it something else - how much the responseSchema feature simplified parsing, how fragile the Platzi category IDs were, something about the accessibility audit results, how long the "boring" parts (README, checklist, tests) took relative to the AI feature itself? Swap this in if so.]
