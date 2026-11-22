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

## Deploy to Cloudflare Workers

`bun run build` builds the Worker and its static assets. Use `bun run preview`
to run the production build locally through Wrangler. Wrangler reads local
settings from `.env` or `.dev.vars`.

The Worker is named `itsogi` in `wrangler.jsonc`. For a Git-connected Worker,
set the deploy command to `bun run deploy` and leave the separate build command
blank, since the deploy script already builds the app.

In the Worker's **Settings → Variables and Secrets**, add `PUBLIC_ORIGIN` as
`https://itsogi.com` and set `PUBLIC_TURNSTILE_KEY` and `PUBLIC_POSTHOG_KEY` as
text variables. Add `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as secrets.
These are runtime settings. With the Worker verified, add `itsogi.com` as a
Custom Domain under **Settings → Domains & Routes**.

Cloudflare Workers Issues groups server failures. PostHog captures browser
exceptions, page views, and named analytics events when `PUBLIC_POSTHOG_KEY`
is set.
