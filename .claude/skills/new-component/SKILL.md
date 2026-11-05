---
name: new-component
description: Create a new React component with a test, following the conventions of this project. Only on an explicit request like /new-component EmptyShelf shows a message when no book matches.
argument-hint: <Name> <what the component does>
disable-model-invocation: true
---

# New component

Arguments: `$ARGUMENTS`

The first word is the component name in PascalCase (`<Name>`). Everything after it is
the purpose. If the name is missing or not PascalCase, or the purpose is missing, ask
once instead of guessing.

## Before you write

- Read an existing component (for example `src/components/Stats/index.tsx`) and its
  neighbours to match style and comment density.
- Check that `src/components/<Name>/` does not exist yet. If it does, stop and say so.

## Create

1. `src/components/<Name>/index.tsx`
   - default export, a function component named `<Name>`
   - props type named `<Name>Props`, declared above the component
   - a component **without** props takes no props parameter and has no `<Name>Props` type
   - presentational only: data and callbacks come in as props, no state for app data
2. `src/components/<Name>/<Name>.test.tsx`, next to the component
   - import `describe`, `expect` and `test` from `vitest` (`globals` is off)
   - render with `@testing-library/react`
   - find elements by role or label, not by test id or class
   - at least one test for the purpose given in the arguments

## Rules

- Logic that is not UI goes in `src/books.ts` with a test in `src/books.test.ts`, not
  inside the component.
- Do not edit `src/data.ts`, do not add dependencies.
- Do not render the new component in `App.tsx` unless the purpose says so. Say in the
  answer where it still has to be used.

## Finish

Run `npm run check` and `npm run test:run`. Report the result and the files you
created. Do not change an existing test to make it pass.
