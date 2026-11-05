# Add a Book

(difficulty: 🔥🔥, with the challenges "Onboard the Agent" and "Write a Skill")

You will work on one project through three challenges, in this order:

1. **Onboard the Agent:** create a `CLAUDE.md` for the project.
2. **Plan Before You Code:** add a feature, in Plan mode.
3. **Write a Skill:** automate one task you do repeatedly.

Work in a git repository (`git init -b main`, `git add .`, `git commit -m "Initial commit"`), so you can always see what the agent changed with `git diff`.

## The project

Bookshelf is the app from the first session: you see a list of books, you can search, filter by genre, mark books as read and remove them. It has no `CLAUDE.md` and no skills yet.

## Challenge 1: Onboard the Agent (🔥)

1. Start Claude Code in the project root and run `/init`. Read the `CLAUDE.md` it drafted. Is everything in it true? Is something missing? Is something in it that Claude would find out by itself in a second?
2. Improve the file. It should cover **stack**, **commands**, **conventions** and **off limits**. Include these facts about the project:
   - Tests run with `npm run test:run`. `npm test` starts the watch mode and never finishes, so an agent must not use it.
   - Components live in `src/components/<Name>/index.tsx`, with a type `<Name>Props` for the props and the test in `<Name>.test.tsx` next to it.
   - Logic that is not UI lives in `src/books.ts` and is tested in `src/books.test.ts`. State is never changed in place, functions return new arrays.
   - Do not add dependencies without asking. Do not edit `src/data.ts`. Never change a test to make it pass, unless the requirement changed.
3. **Test your file:** start a **new** conversation (`/clear`) and ask: "Add a small `Footer` component that shows the text 'Bookshelf'." Did Claude follow your conventions (folder, props type, test)? If not, which line of your `CLAUDE.md` was missing or unclear?
4. Run `/memory` and look at which memory files are loaded.
5. Commit the `CLAUDE.md`, and throw away the Footer (`git restore .` and remove the new folder).

## Challenge 2: Plan Before You Code (🔥🔥)

### The feature

As a reader, I want to **add a book** to my shelf and **keep my books** when I reload the page.

Acceptance criteria:

1. A form "Add a book" has the fields **Title**, **Author**, **Book genre** (the four genres) and **Rating** (not rated, 1 to 5).
2. Title and author are required. Spaces at the start and at the end are removed. An error message is shown in an element with `role="alert"`, and the book is not added.
3. A book with the same title and author (**ignoring upper and lower case**) is rejected with the message "This book is already on your shelf." The same title by another author is fine.
4. A new book is unread, appears in the list and is counted in the line above the list. The form is cleared afterwards.
5. The books are saved in `localStorage` (key `bookshelf:books`) and loaded when the app starts. If nothing is saved, or the saved data is not valid, the sample books are shown.
6. The new code has tests. `npm run check` and `npm run test:run` pass.

### Tasks

1. **Plan mode.** Switch to Plan mode (`Shift+Tab`, until the mode below the input says plan). Give Claude the user story and the acceptance criteria and ask for a plan. It should explore the project first and then propose which files it will change or create.
2. **Review the plan.** Read it like a pull request:
   - Does it use the conventions of your `CLAUDE.md`?
   - Does it handle the edge cases (duplicates, broken saved data, existing tests that now share `localStorage`)?
   - Does it touch files it should not?
   - Is there a step you do not understand?
3. **Correct the plan.** Ask Claude to change at least one thing. Do not approve a plan you have not changed or at least questioned.
4. **Approve and implement.** When Claude offers to start, choose the option where you **review every edit**. Read each diff.
5. **Verify.** Run `npm run check` and `npm run test:run`, and try the feature in the browser (`npm run dev`).
6. **Compare plan and diff:** `git diff --stat`. Did Claude do what the plan said? Did it add or change something that was not in the plan?
7. Write down what you would do differently in the next prompt.

### Questions

- What did Claude get right in the first plan, and what did it miss?
The first attempt failed with addBook is not a function. One of the rejected edits had been the addBook change in src/books.ts, so it never landed. Adding it fixed the type errors and the failing tests.
- Would you have found the problem **after** the code was written, as easily as in the plan?
Claude told me before and after :P
- How much context did the task use (`/context`)?
 96.8k/1m tokens (10%)

## Challenge 3: Write a Skill (🔥🔥)

A **skill** saves a workflow as a Markdown file in `.claude/skills/<name>/SKILL.md`.

1. **A `check` skill.** Create a skill that runs the type check and the tests and reports the result, without changing any files. Think about the `description`: it decides when Claude uses the skill on its own. Start it with `/check`.
2. **A `new-component` skill.** Create a skill that creates a new component following your conventions (folder, props type, test) and receives the name and the purpose as arguments: `/new-component EmptyShelf shows a message when no book matches`. Use `$ARGUMENTS` in the skill.
3. **Test the skills** in a fresh conversation (`/clear`). Does `/new-component` produce what your `CLAUDE.md` demands? Does Claude use `/check` when you ask "does everything still work?" without the slash?
4. Decide for each skill whether Claude should be allowed to start it on its own (`disable-model-invocation: true`), and explain why.
Der check-Skill ist rein lesend: Er führt nur npm run check und npm run test:run aus und berichtet das Ergebnis. Er ändert, erstellt oder löscht keine Dateien und repariert nichts. Das ist durch allowed-tools auch technisch abgesichert, denn erlaubt sind nur diese zwei Befehle plus Lese-Tools. Weil er keine Nebenwirkungen hat und schnell fertig ist (kein Watch-Modus), ist es sinnvoll, dass Claude ihn automatisch nutzt, z. B. nach einer Änderung oder bevor es eine Aufgabe als erledigt meldet. Die description ist genau dafür geschrieben, dass Claude erkennt, wann der Skill passt.

Der wichtigste Punkt ist das Zusammenspiel von zwei Absicherungen: Die Anweisung „nichts ändern“ steht im Text, und allowed-tools schränkt zusätzlich ein, was Claude überhaupt ausführen darf. Selbst wenn Claude ihn ungefragt startet, kann also nichts kaputtgehen. Genau deshalb braucht es hier keine manuelle Freigabe.
5. Commit the skills, so the whole team gets them.

### Questions

- What belongs in `CLAUDE.md` and what in a skill? (Hint: one is **always** loaded, the other only when it is used.)

CLAUDE.md wird immer geladen: Bei jeder Sitzung landet der komplette Inhalt automatisch im Kontext. Von einem Skill steht anfangs nur die kurze description im Kontext. Der eigentliche Inhalt wird erst geladen, wenn der Skill tatsächlich benutzt wird.

Daraus folgt: In CLAUDE.md gehört alles, was fast immer wichtig ist. Zum Beispiel, worum es im Projekt geht und wie es aufgebaut ist, wichtige Befehle (Build, Start, Tests), Code-Konventionen (z. B. „TypeScript, keine any“, Benennungsregeln) und feste Regeln wie „Nie npm test benutzen, das startet den Watch-Modus“. Halte die Datei kurz, weil sie in jeder Sitzung Platz im Kontextfenster kostet, auch wenn sie gerade nicht gebraucht wird.

In einen Skill gehören konkrete Abläufe für bestimmte Aufgaben, die nur manchmal vorkommen. Zum Beispiel Schritt-für-Schritt-Workflows wie dein check-Skill, längere Anleitungen (Deployment, Release, Datenbank-Migration) und Aufgaben mit eigenen Tool-Rechten (allowed-tools) oder solche, die nur manuell gestartet werden sollen. Ein Skill darf ausführlicher sein, weil er den Kontext nur belastet, wenn er wirklich gebraucht wird.

Dein Beispiel zeigt das gut: Der genaue Ablauf „erst npm run check, dann npm run test:run, dann so berichten“ steht im Skill. In CLAUDE.md könnte höchstens ein kurzer Hinweis stehen wie „Vor dem Abschluss einer Änderung die Checks laufen lassen.“

Merksatz: CLAUDE.md ist das Grundwissen, das Claude immer braucht, ein Skill ist das Spezialwissen für eine bestimmte Aufgabe, das nur bei Bedarf geladen wird.

- What happens when the `description` of a skill is vague?

Dann weiß Claude nicht genau, wann der Skill passt, weil es anfangs nur die description sieht. Folgen:

Der Skill wird nicht gestartet, obwohl er passen würde.
Oder er wird im falschen Moment gestartet.

Darum nennt die description des check-Skills konkrete Auslöser wie „is it green?“ oder „run the checks“.

## Development

Install the dependencies with `npm i` first (Node.js 22.22 or newer is required).

- `npm run dev` starts the app in the browser
- `npm run test` runs the tests in the watch mode, `npm run test:run` runs them once
- `npm run check` checks the types
- `npm run build` builds the app
