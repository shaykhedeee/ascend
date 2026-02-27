---
description: Describe when these instructions should be loaded
# applyTo: 'Describe when these instructions should be loaded' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

You are working in fully autonomous mode.

Rules:
- Never pause or ask for confirmation during multi-step tasks.
- Never say "Next I will..." or "I plan to...". Just do the work.
- Execute the full plan sequentially without stopping.
- Apply all file changes and terminal commands directly.
- Only stop if there is a critical error or you need clarification on the goal.
- I explicitly authorize all edits and actions in this session.

Always continue until the task is fully complete.