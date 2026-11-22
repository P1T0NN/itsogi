# SvelteKit project

Includes a Turnstile-protected contact form, Resend email sending, shared time
and error handling, Paraglide localization, and reusable UI components.

Install dependencies with `bun install`, then run `bun run dev`.
Use `bun run check`, `bun run lint:oxlint`, `bun run test:unit --run` and
`bun run build` to validate changes.

## Configuration

- `PUBLIC_TURNSTILE_KEY` and `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile keys.
- `RESEND_API_KEY` and `COMPANY_DATA.RESEND_EMAIL` in `src/shared/config.ts`: email sending.

Auth, audit logging, monitoring, observability, Google integration, rate limiting,
background/durable jobs, filters, pagination and the database (with the todo demo
and database health check) have been removed. The site needs no database.
Cron setup for removed features is gone; existing externally registered jobs
are unaffected by deleting application files.

Read [Turnstile forms](docs/TurnstileForms.md) and [time utilities](src/docs/Time.md)
for the retained feature conventions. Edit translations under `messages/`;
`src/lib/paraglide/` is generated.

`bun run build` selects the Node adapter locally and the Vercel adapter when
`VERCEL=1`. No hosting or provider credentials are needed merely to install.
