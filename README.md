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
   - **`check`: Claude darf ihn selbst starten** (kein `disable-model-invocation`). Der Skill führt nur `npm run check` und `npm run test:run` aus, ändert keine Dateien und ist schnell fertig. Die `description` sorgt dafür, dass Claude ihn z. B. bei "läuft noch alles?" oder vor dem Abschluss einer Änderung nutzt. `allowed-tools` gibt die zwei Befehle ohne Rückfrage frei, sperrt aber keine anderen Tools. Dass nichts verändert wird, steht in der Anweisung im Skill.
   - **`new-component`: nur manuell** (`disable-model-invocation: true`). Der Skill legt Dateien an, hat also Nebenwirkungen, und er braucht Name und Zweck als Argumente, die Claude nur raten könnte. Er startet daher nur, wenn man `/new-component <Name> <Zweck>` selbst tippt.
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


Bonus: Context Lab

1. 36.1k/1m tokens (4%)

Warum ist der Kontext schon belegt, bevor ich etwas getippt habe? Claude Code lädt zuerst seinen Grundbestand:

| Posten | Tokens | Was das ist |
|---|---|---|
| System tools | 25,9k | Die Schemas der eingebauten Werkzeuge (Bash, Edit, Read, Grep, Agent, Artifact usw.). Größter Posten. |
| Skills | 5,1k | Name und description von 29 Skills (Projekt-Skill `check`, eingebaute und claude.ai-Sync-Skills). |
| System prompt | 2,8k | Die Grundanweisungen an das Modell. |
| CLAUDE.md | 0,8k | Die Projektanweisungen aus dem Repo. |
| MCP tools + Instructions | 1,4k | Die claude.ai-Connectoren (Slack, Gmail, Notion …) und ihre Hinweise. |
| Messages | 0,1k | `/clear` und `/context`. |

Zusammen sind das etwa 36k. Nicht mitgezählt sind:

- Deferred tools (39,5k MCP und 25,6k System): Sie werden erst bei Bedarf über ToolSearch geladen, vorher stehen nur ihre Namen im Kontext.
- Autocompact buffer (33k): Er ist nur reserviert, nicht belegt.

Frei bleiben 930,9k Tokens (93 %). Den Grundbestand kann man verkleinern, indem man in `/mcp` ungenutzte Connectoren trennt und in `/skills` ungenutzte Skills abschaltet. Die 25,9k System tools sind fest.

2. 70k/1m tokens (7%) er hat den verbrauch fast verdoppelt.

3. Zur /context-Ausgabe: Der Kontext ist von 36,1k auf 70k Tokens gestiegen. Fast der ganze Zuwachs sind die 34k bei Messages. Das sind die gelesenen src-Dateien und die Zusammenfassung. Der Grundbestand ist mit etwa 36k gleich geblieben. Dafür sind die System tools leicht von 25,9k auf 26,6k gewachsen. Die MCP-Tools werden jetzt mit 0 Tokens als on-demand geführt.

4. 56.2k/1m tokens (6%)
❯ What did I ask you in the beginning?” What do you remember, and what is lost?

Your first request (from the summary, not word for word): you started a new session with /clear and /context and wrote: "Start a new session and run /context. Write down how much is already used before you typed anything. What takes up that space? es sind schon 36,1k wieso ohne frage". You wanted to know why 36.1k tokens were already used before you typed anything.

What I remember (in summary form):
- I explained the 36.1k baseline: system tools, skills, system prompt, CLAUDE.md, and MCP tools and instructions. Deferred tools and the autocompact buffer aren't counted as used.
- I added that explanation to the README under "Bonus: Context Lab".
- You asked me to read and summarize all files in src. I noted that EmptyShelf is unused and that BookCard, BookList and Stats have no tests.
- You pasted a second /context (70k, 7%), and npm run build succeeded.
- Then came /context at 78.1k, /compact, and /context at 56.2k.

What is lost or only approximate:
- The exact wording of your messages and my earlier replies is gone. I only have the compressed summary.
- The src file contents I read are gone, apart from what the summary keeps. After the compaction I re-read the README, books.ts, App.test.tsx and EmptyShelf, so I know those
  again.
- Everything before the /clear is not in this context. That includes the  failed addBook edit. I only know it from your README notes.
- The README has changed since I edited it. Your additions are now visible, and I won't revert them.

What is not lost: the CLAUDE.md rules, the tool and skill definitions, and the system prompt are reloaded every session. That is why the baseline stays near 36k.

The compaction cut Messages from 42.1k to 21k tokens. The full transcript is still on disk as a .jsonl file, so I can look up exact details if you need them.

5. Ja, die CLAUDE.md wird nach dem /clear weiterhin geladen. Das zeigt die /context-Ausgabe unter "Memory files":

- 1 Datei, 837 Tokens
- Typ Project, Pfad C:\Users\atgam\web-bootcamp\ai-working-with-coding-agents_add-book-feature\CLAUDE.md

Die Inhalte (Stack, Befehle, Architektur, Konventionen, "Off limits") liegen mir in dieser Sitzung auch vor. /clear leert nur den Gesprächsverlauf. Die CLAUDE.md wird bei jedem Start oder /clear neu eingelesen.

6. 
1. Die CLAUDE.md gilt in jeder Sitzung, auch nach /clear. Ich halte mich an ihre Vorgaben, ohne dass sie jemand wiederholen muss. Dazu gehören npm run test:run statt npm test, kein Bearbeiten von src/data.ts und keine neuen Abhängigkeiten ohne
  Rückfrage.
2. Ich verlasse mich auf die CLAUDE.md und lese sie nicht erneut. Sie liegt schon im Kontext. Wenn ich unsicher bin, schaue ich dort nach, statt zu raten. Ändert sich die Datei mitten in der Sitzung, lese ich sie neu ein, weil mein Stand dann veraltet sein kann.
3. Was in der CLAUDE.md steht, speichere ich nicht zusätzlich im Memory. Dort lege ich nur Dinge ab, die nicht im Repo stehen, zum Beispiel Vorlieben von dir oder Hintergründe zum Projekt. Sonst gibt es zwei Quellen, die au


## Development

Install the dependencies with `npm i` first (Node.js 22.22 or newer is required).

- `npm run dev` starts the app in the browser
- `npm run test` runs the tests in the watch mode, `npm run test:run` runs them once
- `npm run check` checks the types
- `npm run build` builds the app
