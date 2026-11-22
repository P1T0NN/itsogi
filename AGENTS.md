## Localization

- Translations are an inlang project. Before localization work, read `project.inlang/README.md`. It covers checks, machine translation and editors. It is git-ignored, so search tools may skip it.
- Edit messages in `messages/{locale}.json`. Never edit `src/lib/paraglide/`: Paraglide JS generates it.

## Svelte and SvelteKit

- For Svelte or SvelteKit work, use the official Svelte MCP: call `list_sections` first, then fetch relevant guidance with `get_documentation`. Run `svelte_autofixer` on changed `.svelte` and `.svelte.ts`/`.svelte.js` code and resolve its findings.

## Coding rules

Before writing, editing, or reviewing application code, read `src/docs/CodingRules.md`. It defines this template's conventions, including when initial page data must be server-rendered and when to show loading skeletons.

## Agent skills

This repository is a universal starter template, copied into new projects.
Keep template instructions reusable; each new project maintains its own tasks
and domain documentation.

### Issue tracker

Track issues and specs locally under `.scratch/<feature>/`.
See `docs/agents/issue-tracker.md`.

Before resuming an existing feature, read `.scratch/<feature>/spec.md` if present,
including its resume checkpoint and chunk boundaries. Inspect the current code
to verify the recorded state before continuing; do not rely on previous chat memory.

### Triage labels

Use the five default triage statuses.
See `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context layout: root `GLOSSARY.md` and `docs/adr/`.
Before domain exploration, read `docs/agents/domain.md`.
