# Reflection - Style Stylist

## What was hardest, and why

One real friction point in the build: the AI integration was originally written for the Claude API, then swapped to Gemini mid-project because that's the key you actually had available to test with. That's a bigger change than it sounds - it's not just a different API endpoint, it's a different approach to getting structured output (Gemini's `responseSchema` versus prompt-only JSON), which meant re-thinking how to guarantee the response could actually be parsed instead of just hoping the model followed instructions.

## What I'd do differently next time

Testing with a real API key happened late - after the code was written and "verified" only by the fact that it compiled. Compiling clean and actually working are different things, and the gap between them wasn't checked until fairly late in the process. Testing the API key during production of the code is the best and easier way to complete the product without any long hours of debugging.

## One thing that surprised me

The anti-hallucination design - never letting the model supply price, image, or title, only an id and a reason, then validating every id against the real catalog server-side - turned out to matter more than the prompt wording itself. A well-designed constraint on *what the model is trusted to output* did more for reliability than trying to phrase a "perfect" prompt.
