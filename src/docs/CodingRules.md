# Coding Rules

## UX guidance

Before implementing or changing UI interactions, read the repository-root [DESIGN.md](../../DESIGN.md). It contains reusable UX guidance, including when to use automatic filtering or Apply filters. Keep that guidance in DESIGN.md rather than duplicating it here.

## UI components: inspect and reuse existing components

Before creating or changing UI, LLMs must inspect `src/components/ui/`, including its custom components, for existing components that fit the task. Read their exports and props, then reuse and compose them instead of duplicating components, markup, styles, or behavior already provided there. Create a new component only when the existing components cannot meet the requirement. Check compatibility with the page's form system before using form components; do not assume Superforms components accept SvelteKit remote forms.

## Icons: use Iconify utilities

Use the existing `@iconify/tailwind4` integration for icons, for example `<span class="icon-[lucide--search] size-4" aria-hidden="true"></span>`. Keep complete icon class names literal so Tailwind can generate them. Use Iconify rather than importing Lucide Svelte icon components. Size icons explicitly and hide decorative icons from assistive technology; icon-only controls still need an accessible label.

## Tailwind: use stock utilities, never arbitrary values

Never write arbitrary utility values in square brackets, such as `p-[13px]`, `text-[clamp(...)]`, `leading-[0.78]`, `grid-cols-[1.1fr_1fr]` or `-rotate-[1.5deg]`. Use the utilities and scale steps Tailwind provides out of the box, and compose responsive variants when a single step cannot express the design. When no stock utility matches exactly, use the nearest step and adjust the design to it rather than reintroducing a hardcoded value.

```svelte
<!-- Bad -->
<h1 class="text-[clamp(9rem,42vw,24rem)] leading-[0.78] font-stretch-[62%]">
<!-- Good -->
<h1 class="text-9xl leading-none font-stretch-extra-condensed">
```

Bare values that a stock utility natively accepts, such as `aspect-9/16` or `rotate-1`, are allowed, as are custom properties whose value comes from the theme scale, such as `[--card-spacing:--spacing(4)]`. The ban covers arbitrary values, not variant selectors (`data-[...]`, `has-data-[...]`, `[&_svg]:...`) or the required Iconify icon syntax (`icon-[lucide--search]`).

## Component ownership: keep logic local and props minimal

Define component-specific functions, constants, derived values and state inside the component that owns and uses them whenever possible. Keep parent components focused on composition. Lift a value or function to the nearest common parent only when multiple components need to share it and it cannot reasonably remain local. Pass only the necessary values and callbacks to children, and calculate child-only values in the child.

Preserve each component's markup boundary when moving logic: putting a handler in its owning component does not mean moving unrelated headers, filters or panels into that component. Reuse existing shared feature utilities and configuration instead of duplicating them inside components.

## Page data loading: choose by indexability

Before implementing page data loading, LLMs must determine whether the content is intended for search engines. Apply this policy in every project copied from this template:

| Page purpose                                                                         | Initial data loading                                                                                                                |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Public content intended to be indexed, such as a catalog, article, or public listing | Await the primary query so the initial server-rendered HTML includes content.                                                       |
| Auth-protected, admin, or developer page                                             | Render the page shell and loading skeletons immediately; resolve content asynchronously without blocking initial rendering for SEO. |
| Other unprotected pages                                                              | Follow their indexing requirements; being accessible without authentication alone does not make content SEO-critical.               |

### Public indexable pages

Resolve the primary query in the page with `const result = $derived(await query)` and pass `query={result}` to `DataList`.

The deliberate tradeoff is that the initial response waits for data instead of immediately displaying a skeleton. This gives crawlers actual content. Query speed is not guaranteed: await only data needed for indexable content, and let secondary widgets load independently.

Keep the primary content outside `<svelte:boundary>` blocks with a `pending` snippet, which render placeholders during SSR. Passing an unresolved promise to `DataList` also renders its pending branch during SSR; resolve the query first for indexable content. Let initial query failures reach the framework's error handling rather than presenting a failed fetch as an empty successful list.

Awaiting initial data does not remove loading feedback during later pagination, refreshes, or filtering. Provide loading feedback in the component that owns the interaction.

### Auth-protected, admin, and developer pages

These pages have no requirement to include fetched content in initial HTML for SEO. Pass the unresolved query directly to `DataList`, for example `query={query}`, together with its loading snippet. Let the shared component handle pending, resolved, empty, and error states. Avoid a page-level `$derived(await query)` for this content so the initial skeleton can render without waiting for the query. For async content outside data lists, use a scoped `<svelte:boundary>` with a `pending` snippet when necessary.

This policy governs waiting for data, not whether SvelteKit can render a page shell on the server. Keep SSR enabled by default; an absent SEO requirement alone does not require `ssr = false`. If client-only rendering is explicitly needed, scope it to the relevant route or route group so public indexable pages retain SSR.

Preserve server-side authentication and authorization for every protected query and mutation regardless of loading strategy. Loading skeletons, client-only rendering, and `noindex` metadata are not access controls.

## Data lists: wrap big lists in `<DataList>` and split items and loading into components

Whenever a page renders a big data list, it must be wrapped under `<DataList>` from `src/components/ui/custom-components/data-list/data-list.svelte`, and whatever it needs must be passed to it: the called query, `getKey`, empty and error text, and a `loading` snippet when the page has one. Do not hand-roll await, list, or pagination markup in pages.

Every list item has its own `(name)-item.svelte` file in the page component folder. It receives one row and renders the complete `<li>`; the page renders that component through the `children` snippet.

The loading snippet must be a `(name)-loading.svelte` file under the `/loading/` subfolder of the same page component folder, for example `src/components/pages/(unprotected)/<page>/loading/<page>-loading.svelte`, and is passed through the `loading` snippet.

## Testing scope and locations

Write tests for substantive function behavior: business rules, validation, parsing, pagination logic, queries, mutations, authorization and failure handling. Cover meaningful success, error and boundary cases. Do not add tests for trivial wrappers or tests that merely repeat the implementation; do not extract helpers solely to test them.

Test meaningful behavior in complex custom components when regressions would affect users. Use focused browser tests for interactions and layout that require a real browser, such as DataList's loading/error transitions and form validation and submission. Use small component fixtures only when needed to exercise that behavior. Avoid trivial markup tests, broad snapshots, and tests that merely duplicate coverage provided by shadcn primitives or other dependencies.

Validate UI changes with type checking, linting and the Svelte autofixer as well. Browser assertions verify only what they check; claim visual inspection only after actually reviewing the rendered component or its screenshots. Report any browser checks that could not run.

Keep all feature tests under that feature's `/test/` folder. For example, contact mutation tests belong in `src/server/contact/test/`, never beside implementations in `/mutations/`.

## Required validation: run Oxlint after every code change

LLMs must run `bun run lint:oxlint` after every code change and before reporting the work complete. Resolve diagnostics caused by the change. If Oxlint cannot run, explicitly report the failure; never claim validation passed without running it.

## Conditions: name what the branch checks

Before an `if` or `else if`, assign compound or nontrivial conditions to a clearly named boolean `const` that explains the branch's meaning. Put that name inside the condition, for example `if (hasInvalidTiming)`, rather than embedding several checks joined by `&&` or `||`. Keep constants near their branches and preserve short-circuiting and type narrowing. A very small single check, such as `if (pending)`, `if (!allowed)`, or a simple type guard like `if (isRedirect(cause))`, may stay inline.

```ts
const hasInvalidBudget = !Number.isInteger(maxRequests) || maxRequests <= 0;

if (hasInvalidBudget) return;
```

## Assignments: keep short expressions on one line

Keep `const name = expression` on one line when it comfortably fits the project's formatting width. Break after `=` only when the expression genuinely needs the extra space. For a long lookup or fallback, use a meaningful intermediate constant when it improves readability and keeps the assignments on one line.

```ts
const defaultLimit = 20;
const limit = options.limit ?? defaultLimit;
```

## Return objects: calculate values before returning

LLMs must calculate derived values in named local constants before returning an object. Do not put function calls, calculations, comparisons, or conditional expressions directly in returned object properties. Use property shorthand in the return object so it is easy to read.

```ts
const allowed = counter !== undefined;
const remaining = counter ? Math.max(0, maxRequests - counter.requestCount) : 0;
const retryAfter = counter ? 0 : Math.max(1, Math.ceil(windowEnd - now));

return {
	allowed,
	remaining,
	retryAfter
};
```

## Imports: separate type imports

Place every type-only import in a separate `import type { ... } from '...';` declaration under a `// TYPES` comment. Keep runtime imports in their corresponding sections. Never mix inline `type` specifiers into runtime imports, including when a schema and its derived type come from the same module.

```ts
// SCHEMAS
import { contactSchema } from '@/shared/features/contact/schemas/contactSchemas';

// TYPES
import type { typesContactInput } from '@/shared/features/contact/schemas/contactSchemas';
```

## Zod schemas: shared location and derived types

Place every pure Zod schema in `src/shared/features/<featureName>/schemas/<name>Schemas.ts`, including schemas used only by server code. Keep these schema modules free of server-only imports. For example, contact form validation belongs in `src/shared/features/contact/schemas/contactSchemas.ts`.

Define every Zod schema-derived type in the same file as its schema, immediately after the schema definition. Do not duplicate the schema's shape manually.

Every schema-derived type must start with `types` and end with `Input` or `Output`: use `typesOffsetPaginationInput = z.input<typeof offsetPaginationSchema>` for data before parsing and `typesOffsetPaginationOutput = z.output<typeof offsetPaginationSchema>` for parsed data. Choose the suffix based on what the type represents, including defaults and transformations.

Write each feature's main type in a `(name)Types.ts` file under that feature's `/types/` folder, because it is a feature type, and export it under its domain name: `GameEvent` lives in `src/features/events/types/eventsTypes.ts`. Only feature types are written in these files; never move Zod-derived `types...Input`/`types...Output` types or component-only types into `/types/`.

## Helpers, queries, and utilities

Put operations that cause external side effects, including sending email, under `/mutations/`. Reserve `/queries/` for read operations.

Place reusable callback implementations under the owning feature's `/callbacks/` folder, in the appropriate server, feature or shared layer. A callback is a function supplied to another function, hook, event system, scheduler or SDK for that receiver to invoke; use this folder for standalone functions whose primary role is that callback contract. Keep server-only callbacks under `src/server/<feature>/callbacks/`.

Accepting a callback does not make a function itself a callback: schedulers, wrappers, queries and mutations keep their own responsibility-based placement. Passing an existing business mutation as a callback does not require moving that mutation. Keep one-off inline callbacks and component-only handlers local; do not extract them solely to create a `/callbacks/` file. Reuse an existing callback implementation before adding another for the same behavior.

Keep provider-specific SDK clients, transport, webhook handling, classifiers and tests under `src/server/<provider>/`, for example `src/server/resend/`. Name provider-specific entry points explicitly, such as `sendEmailResend.ts`. Pure Zod schemas still belong under `src/shared/features/<provider>/schemas/*Schemas.ts`. Keep provider-independent email types and templates in `src/shared/features/emails/` so they do not depend on a delivery provider.

Put parsing and validation utilities under `/utils/`, including server utilities that turn invalid input into HTTP errors.

Use `/helpers/` for server functions that call an external service, for example `helpers/verifyTurnstile.ts`. Reserve the `get` prefix for helpers that retrieve data. Files and functions under `/helpers/` are strictly forbidden from using the `fetch` prefix.

The `fetch` prefix is reserved exclusively for files and functions under a `/queries/` folder, for example `queries/fetchUsers.ts` exporting `fetchUsers`. This naming rule does not prohibit calling the platform's `fetch()` API inside a helper.

Use `/utils/` for pure JavaScript or TypeScript functions: their results depend only on their inputs, with no network requests, side effects, or reads of the current time or random values. Use a verb describing the operation, such as `calculate`, `format`, or `parse`, instead of `get` or `fetch`. The caller must supply any time-dependent inputs.

The explicit exception is the shared time feature's `utils/readCurrentTimestampSeconds.ts` and `utils/readStopwatchMilliseconds.ts`: these clock readers intentionally read the current clock and are usable on both server and browser. Other time utilities remain pure conversions or formatting.

## Function declarations: naming and exports by file type

In `.svelte` components, use camelCase function names without underscores, for example `clearSelection` and `applyFilter`. Keep functions local; never export functions from a `.svelte` file, including from `<script module>`. Use callback props or shared state for communication between components rather than exposing methods through a component reference.

The `_` prefix rule applies only to `.ts` files, including `.svelte.ts` modules. Before defining a named function (`function name(...)` or `async function name(...)`) in these files, check its callers and consider whether it is intended for reuse elsewhere, including planned use. If it is only an implementation detail of the current file, keep it in that file, do not export it, and prefix its name with `_` so its private scope is immediately visible.

For example, `_formatSearchParams(...)` in `src/hooks/useSearchParams.svelte.ts` is a private helper. The exported `useSearchParams(...)` keeps its normal name. Functions exposed through the hook's returned object, such as `buildUrl`, `write`, and `onPopState`, are also public API and keep their normal names even though their declarations are inside the same file.

Do not create an export or a separate file solely for hypothetical future reuse. Reassess the helper's name and location when another caller actually needs it.

## Time source

Before adding or changing time/date handling, read the [time feature guide](Time.md) and inspect the existing feature under `src/shared/features/time/`. Reuse its clock readers, timestamp conversions, date/time formatter and configuration. Application logic must use these exports instead of introducing direct current-clock reads (`Date.now()`, `performance.now()` or no-argument `new Date()`), competing time helpers or ad hoc date formats. Extend the existing time feature when a required capability is missing so the project keeps one consistent convention.

Use `TIME_CONFIG.DEFAULT_TIME_ZONE` (UTC by default) and `TIME_CONFIG.LOCALE` (en-GB by default) from `src/shared/features/time/config.ts`. Keep project timezone/locale defaults in this configuration; do not hardcode different defaults in individual features or components. Both settings control presentation and must not shift stored instants or token expiry. Import browser-safe functions directly from their individual files under `src/shared/features/time/utils/`. Keep the documented timestamp units consistent and convert at API/display boundaries rather than inventing a new representation per feature.

Keep machine transport and `<time datetime>` values as UTC ISO strings. Native parsing/construction of explicitly supplied dates, independent test clocks/fixtures, generated/vendor timestamp hooks and provider-specific timestamp decoding keep their native contracts; these exceptions do not introduce competing application clocks or timezone defaults.

## Links: use `<Link>` instead of `<a>` for internal links

Use the `Link` component (`@/components/ui/custom-components/link/link.svelte`) for every internal link instead of a plain `<a>` — it localizes the `href` (locale prefix + SvelteKit base path) via `i18nHref` automatically:

```svelte
<script>
	import Link from '@/components/ui/custom-components/link/link.svelte';
</script>

<Link href="/about">About</Link>
<Link href={page.url.pathname} {locale}>Switch language</Link>
```

It accepts all `<a>` attributes plus an optional `locale` (defaults to the active one). Pass `locale` only when targeting a different locale. Never combine `resolve` and `localizeHref` by hand — that logic lives in `i18nHref`. External URLs and static assets should still use a plain `<a>`. For an internal URL already built by `useSearchParams.buildUrl`, pass `resolved` to `Link` so its existing base path and locale are preserved.

## Translations: SEO message keys

Every page keeps its SEO text in `messages/{locale}.json` under `<PageNamespace>.SEO.<key>`, separate from the visible text of its components. This covers the document title, meta description, social-share text and structured-data text such as event names and descriptions. The home page uses `HomePage.SEO.title`, `HomePage.SEO.description` and `HomePage.SEO.eventName`; a future about page would use `AboutPage.SEO.title`. Add the same keys to every locale file.

```ts
// Good
title={m['HomePage.SEO.title']()}
// Bad: SEO text mixed into the page namespace or a component namespace
title={m['HomePage.title']()}
title={m['HomePage.HomeHeroSection.metaTitle']()}
```

Keep the title around 60 characters and the description around 155, the lengths search results show in full. Machine-only text that no visitor reads, such as `llms.txt`, may stay in English in code.

## Programmatic navigation: use `i18nGoto` instead of `goto`

The same rule applies in code: whenever you navigate to a route in this app, use `i18nGoto` from `@/utils/i18nGoto` instead of `goto` from `$app/navigation`:

```ts
import { i18nGoto } from '@/utils/i18nGoto';

i18nGoto('/settings', { replace: true });
```

It localizes and resolves the path (exactly like `i18nHref`) before calling `goto`, and accepts all `GotoOptions` plus an optional `{ locale }`. Only keep plain `goto` for URLs that are already localized and resolved.

## Errors

Every error passes through the `handleError` hook with a `kind` of `'app'`, `'framework'`, `'validation'` or `'unknown'`, and rendering errors bubble up to the nearest `+error.svelte` or `<svelte:boundary>`.

### Shared validation messages

Reuse `src/shared/features/errors/utils/formatZodValidationError.ts` for generic Zod validation wording. `src/shared/features/errors/config.ts` registers it once through `z.config({ customError: formatZodValidationError })`; both server and client hooks import that configuration. Match structured Zod issue codes and constraints, never parse or replace default message strings. Keep the formatter pure and use schema-level messages only for feature-specific requirements; those override the global defaults. Display form validation issues beside their fields, not through the remote-error toast handler. Do not change global Zod configuration per request or per user locale.

### Centralized client-side remote error handling

Before adding client-side error handling for remote functions, LLMs must inspect and reuse `src/shared/features/errors/utils/handleRemoteFunctionsError.ts`. Add reusable error recognition and its user-facing toast behavior there instead of duplicating status checks, messages, or toast calls across wrappers and components. It handles HTTP 429 with the retry delay and HTTP 500–599 with a generic error toast. Add other error cases only when explicitly required.

Define remote queries and commands in `.remote.ts` files with native `query` and `command` from `$app/server`. Use `safeForm` from `src/wrappers/safeForm.ts` for remote forms that support Turnstile. Preserve native validation, results, failures and redirects. Never import server runtime factories into client components.

Lists display their configured generic error message inline without another toast or raw exception details. Initial awaited SSR failures retain framework error pages.

Call remote commands directly. When a client command needs toast handling, catch its error at the call site and delegate to `handleRemoteFunctionsError(cause)`. It returns `true` when handled and `false` otherwise; always rethrow unhandled errors and stop before success-only UI work after a handled error:

```ts
if (!handleRemoteFunctionsError(cause)) throw cause;
```

Render remote forms with `Form` from `src/components/ui/custom-components/form/form.svelte`: `<Form form={sendContact} schema={contactSchema} onsuccess={handleSent}>...</Form>`. This is the project's native remote form component, not Formsnap or Superforms. Pass the remote form and its schema directly; the component owns `.preflight(schema)` and `.enhance()`. Do not call `.preflight()` in individual pages. The component wraps the Standard Schema validator to show a generic validation toast and returns the original result unchanged. Do not observe pending state with `$effect` to infer validation failure. Explicit `.validate()` calls use the same validator and can therefore show this toast even without submission. It calls the native `instance.submit()`, and delegates caught submission errors directly to `handleRemoteFunctionsError`. Keep this small submission flow inside the component; do not extract a separate submission wrapper or utility. Keep the success callback outside the submission catch so errors in success UI are not treated as server submission failures. Its `onsuccess` callback runs only when native `submit()` returns `true`; validation failures and handled errors skip it. Keep page-specific success handlers in `<script>`; they should only perform success UI work, such as resetting the form or showing a success toast. The server's returned data remains on the remote form's `.result` property. Preserve native `method`, `action`, and enhancement for progressive enhancement.

Use `FormField` from `src/components/ui/custom-components/form/form-field.svelte` inside the shared `Form` for labels, descriptions, and inline errors. Pass the native field accessor, a unique `id`, and a `label`. Spread its `control` snippet properties after the native field attributes so the visible error state controls `aria-invalid`. It hides errors only for the edited field until the next validation attempt, using form context instead of page-specific state or effects. For custom controls that do not emit native input/change events, call the provided `clearErrors` snippet function from their value-change callback.

Opt in to captcha per form with `turnstile={{ action: 'operationName' }}` on `Form` and the matching `turnstile: { action: 'operationName' }` server option on `safeForm`. Use the optional `actions` snippet to place submit controls below verification. The shared component owns the script/widget lifecycle, native sensitive hidden field, preflight transport-field stripping, inline form-wide issues and token renewal after submissions. Keep captcha fields out of business schemas and never redeem tokens during schema validation or `.validate()` calls. Server forms verify with Cloudflare after validation and before business work. Never rely on the client prop alone. See [Turnstile forms](../../docs/TurnstileForms.md).

Do not show a second toast for an error already handled centrally. A handled rejection must skip success-only UI work, including when a successful command returns `undefined`.

This handler is for client-side presentation. Keep server validation, authorization, and framework `handleError` hooks in their existing server or framework layers. Do not show raw unexpected error messages to users.

Server failures caught by command callers or the shared `Form` component must use centralized toast handling and skip success-only work, allowing the user to remain on the current page. The form component stops its submission handler on failure. Errors during page loading or rendering still use SvelteKit's error pages. An HTTP status alone does not identify an error as critical; do not route wrapped mutation failures to an error page merely because the status is 500. Unhandled client exceptions continue to propagate. Without JavaScript, native form submissions use SvelteKit's normal responses; client toasts require JavaScript.

### What you don't need to handle yourself

With the `handleError` hooks in `src/hooks.server.ts` / `src/hooks.client.ts` in place, these are automatic — don't re-implement them:

- **No route matched (404), POST to a page without actions (405), request body too large (413)…** — framework errors, generated by SvelteKit itself.
- **Invalid remote-function data** — generic 400; the issues are logged in `handleError` and never shown to users.
- **Unexpected exceptions** — 500; logged in `handleError`, users see `'Something went wrong'`.

So only call `error(...)` yourself for app-specific outcomes (record not found, not authorized, conflict…) and pick the status there — anything unexpected can simply throw.

### App errors — when to use `error()`

Call `error(status, message, extra?)` from `@sveltejs/kit` whenever **your own app code** decides a request can't be fulfilled (not found, forbidden, bad input…):

```ts
import { error } from '@sveltejs/kit';

if (!post) {
	error(404, 'Not found');
}
```

SvelteKit catches it, sets the response status, and renders the nearest `+error.svelte`, where the `error` prop is an `App.Error` (`{ status, message }`). App errors are safe to expose, so `handleError` receives them with `kind: 'app'` and passes them through unchanged. Add extra properties if useful: `error(404, 'Not found', { code: 'NOT_FOUND' })`.

### Framework errors

Generated by SvelteKit itself, not your code — no route matched (404), POST to a page without actions (405), request body too large (413), and so on. `kind: 'framework'`, shape `{ status, message }` with a safe terse message (`'Not Found'`), so it can be shown as-is. If you log errors in `handleError`, skip these — routine 404s aren't worth logging.

### Validation errors

Happen when a remote function is called with invalid data. `kind: 'validation'`, with the generic `{ status, message }` plus an `issues` array (SvelteKit responds with a generic 400). Use the issues to log or customize the response in `handleError`, but don't expose them to users — they may help an attacker. Returning `error` unchanged is safe (it only holds the generic status/message). Only pass `'unchecked'` instead of a schema if you know what you're doing.

### Unknown errors

Any other exception while handling a request. `kind: 'unknown'`; users only see the generic `{ status: 500, message: 'Internal Error' }`. The raw thrown value reaches `handleError` — report it, map error types to custom statuses/messages, or return a safe error. Nothing is exposed unless you choose to.

```ts
import type { HandleServerError } from '@sveltejs/kit/hooks';

export const handleError: HandleServerError = ({ kind, error }) => {
	if (kind === 'unknown') {
		// report `error` here
		return { message: 'Something went wrong' };
	}

	// app, framework and validation errors are already safe to expose
	return error;
};
```

### Error boundaries

Errors thrown during `load` or rendering (e.g. inside a component's `<script>` or template) bubble to the nearest `+error.svelte`. To handle them more granularly, wrap the subtree in `<svelte:boundary>`:

```svelte
<svelte:boundary>
	...
	{#snippet failed(error: App.Error)}
		{error.message}
	{/snippet}
</svelte:boundary>
```

### Where the error page comes from

- Error in a `load` function while rendering a page → nearest `+error.svelte`.
- Error in the root `+layout.js`/`+layout.server.js` → the fallback page (`src/error.html`), since the root layout would normally contain `+error.svelte`.
- Error inside `handle` or a `+server.js` handler → fallback page or a JSON error, depending on the request's `Accept` header.

Customize the fallback in `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%`.
