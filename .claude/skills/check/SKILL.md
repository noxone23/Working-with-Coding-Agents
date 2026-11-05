---
name: check
description: Run the type check and all tests once and report whether everything still works. Use when the user asks "does everything still work?", "is it green?", "run the checks" or wants to verify a change before finishing. Read-only, it never changes files.
allowed-tools: Bash(npm run check) Bash(npm run test:run) Read Grep Glob
---

# Check

Run these two commands, in this order, and report the result. Do not edit, create or
delete any file, and do not fix anything. This skill only reports.

1. `npm run check` (type check, `tsc --noEmit`)
2. `npm run test:run` (all tests once)

Never use `npm test`: it starts watch mode and never finishes.

Run both commands even if the first one fails, so the report is complete.

## Report

- One line per command: passed or failed.
- On a failure, quote the real error output: for the type check the file, line and
  message; for the tests the name of each failing test and its message.
- If both pass, say so in one sentence with the number of tests.
- Do not change a test to make it pass. If a test fails, report it and stop.
