# Feature pruning

Keep todo, Turnstile, PostgreSQL/Drizzle database code and migration history,
Resend, guest identities, Paraglide, and shared time/errors/emails/fingerprint.
Remove other application features, their routes, tests, dependencies and wiring.
Do not install dependencies or modify a running database.

Database-only table definitions and SQL constraints are retained under
`src/server/database/`, even for features whose runtime is removed. Keep the
database health probe. Remove cron setup for the removed features.
Todo becomes a simple public list and Turnstile-protected creation form.
Keep reusable UI primitives and framework/localization tooling.

## Resume checkpoint

Complete. Other feature runtimes, routes, tests, dependencies, startup validation
and auth/Google entries in `.env` and `.env.local` removed. Database-only table
definitions moved under `src/server/database/schemas/`; existing SQL constraints
and all 12 migration files retained. Database reachability helpers/tests moved to
the database folder. Resend sending retains validation and a request deadline;
monitoring-only delivery webhooks and notification templates are removed.

Todo retains initial SSR, refresh feedback, shared list rendering and the
Turnstile creation form. It fetches all rows and has no rate limiting or ownership.
Guest cookie signing retains the `RATELIMIT_SECRET` name and format.

Validation:
- Local import and direct package dependency scan passed.
- Retained feature folders match the keep list.
- All 12 migration SHA-256 hashes match the baseline in `migrations.json`.
- Bun parsed all 102 TypeScript source/test files successfully.
- Official Svelte autofixer passed for all four changed components.
- `bun run lint:oxlint`, `bun run check` and `bun run test:unit --run` could not
  start: oxlint, svelte-kit and vitest are not installed.
- Dependencies were not installed. Build, browser and live-provider/database
  checks were not run. No database statements or hosting changes were executed.
