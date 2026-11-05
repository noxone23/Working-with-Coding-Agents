# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Bookshelf: a small React 19 + TypeScript app built with Vite. Tests use Vitest, jsdom and Testing Library (`@testing-library/react`, `user-event`, `jest-dom`). Node.js 22.22 or newer. No backend, no router, no state library: state lives in `App.tsx` (`useState`).

## Commands

- `npm run dev` starts the app (port 3000)
- `npm run test:run` runs all tests once. **Always use this.** `npm test` starts watch mode and never finishes.
- `npx vitest run src/books.test.ts` runs one test file; add `-t "<name>"` for a single test
- `npm run check` type-checks (`tsc --noEmit`)
- `npm run build` builds the app

Before finishing a change, run `npm run check` and `npm run test:run`.

## Architecture

- `src/types.ts`: `Book`, `Genre`, `GenreFilter`. `rating` is 1 to 5, `0` means "not rated".
- `src/books.ts`: all non-UI logic (filter, toggle read, remove, stats). Pure functions that return **new arrays**; never mutate state in place. Tested in `src/books.test.ts`.
- `src/data.ts`: the sample books (`initialBooks`).
- `src/App.tsx`: owns the state (`books`, `genre`, `query`) and passes data and callbacks down to the components.
- `src/components/<Name>/index.tsx`: presentational components (`BookList`, `BookCard`, `Stats`).

## Conventions

- Component: folder `src/components/<Name>/index.tsx`, default export, props type named `<Name>Props`, test in `<Name>.test.tsx` next to it.
- A component without props takes no props parameter and needs no `<Name>Props` type.
- Tests import `describe`, `expect` and `test` from `vitest` (`globals` is off), as in `src/books.test.ts`.
- Put logic that is not UI in `src/books.ts` and test it in `src/books.test.ts`, not inside components.
- Tests find elements by role or label (accessible queries), as in `src/App.test.tsx`.

## Off limits

- Do not add dependencies without asking.
- Do not edit `src/data.ts`.
- Never change a test to make it pass, unless the requirement changed.
