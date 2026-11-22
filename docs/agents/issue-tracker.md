# Issue tracker: Local Markdown

Issues and specs live as Markdown files in `.scratch/` within each project.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`.
- Specs: `.scratch/<feature-slug>/spec.md`.
- Implementation tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`,
  one file per ticket, numbered from `01`.
- Record triage state in a `Status:` line near the top of each ticket.
  Use the statuses in `triage-labels.md`.
- Append conversation history under `## Comments`.

## Publishing and fetching

When a skill says "publish to the issue tracker", create the appropriate
file under `.scratch/<feature-slug>/`, creating directories as needed.

When a skill says "fetch the relevant ticket", read the referenced file.
The user may supply its path or ticket number.

## Wayfinding operations

Used by `/wayfinder`:

- Map: `.scratch/<effort>/map.md`, with Notes, Decisions-so-far, and Fog.
- Child ticket: `.scratch/<effort>/issues/NN-<slug>.md`.
  Record its question and a `Type:` of `research`, `prototype`,
  `grilling`, or `task`.
- Dependencies: a `Blocked by: NN, NN` line near the top.
  A ticket is unblocked when every listed ticket is resolved.
- Frontier: select the lowest-numbered open, unblocked, unclaimed ticket.
- Claim: save `Status: claimed` before starting work.
- Resolve: append the answer under `## Answer`, set `Status: resolved`,
  and add a gist and link to Decisions-so-far in the map.
