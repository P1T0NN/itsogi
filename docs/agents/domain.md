# Domain docs

Use a single-context layout within each project:

- `GLOSSARY.md` at the project root for domain vocabulary.
- `docs/adr/` for architecture decision records.

## Before exploring the domain

Read `GLOSSARY.md` and ADRs relevant to the area being explored.

If these files do not exist, proceed silently. Create them through
the domain-modeling skill when terms or decisions are resolved.

## Vocabulary

Use the glossary's terms in issue titles, proposals, hypotheses,
and test names.

If a concept is missing, reconsider whether the project uses it
or note the gap for domain modeling.

## Decisions

Explicitly identify proposals that contradict an existing ADR,
and explain why the decision should be reopened.
