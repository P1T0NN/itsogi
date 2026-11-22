# Turnstile on remote forms

Turnstile is opt-in for each form. The public add-todo page is the working example.
Set `PUBLIC_TURNSTILE_KEY` and its matching private `TURNSTILE_SECRET_KEY`, and allow
the application's hostname in the Cloudflare widget configuration.

Declare protection on the remote endpoint:

```ts
export const createTodo = safeForm(
	{ turnstile: { action: 'createTodo' } },
	createTodoSchema,
	(input) => createTodoMutation(input)
);
```

Enable the corresponding widget on the shared form, using the same action:

```svelte
<Form
	form={createTodo}
	schema={createTodoSchema}
	turnstile={{ action: 'createTodo' }}
	onsuccess={handleCreateTodo}
>
	<!-- FormField controls -->
	{#snippet actions()}
		<Button type="submit" disabled={createTodo.pending > 0}>Add todo</Button>
	{/snippet}
</Form>
```

The optional `actions` snippet places the submit controls below the challenge.
Existing forms can keep their buttons in `children`. An optional client `siteKey`
overrides `PUBLIC_TURNSTILE_KEY`; it must match the server's configured secret.
Action names accept 1–32 letters, numbers, underscores or hyphens. Use an action
specific to the operation, and keep it out of user-supplied data.

Schema-based and no-input declarations both work. Public forms validate
application data, then verify with Cloudflare. Only verified submissions reach
the business handler. Omitting the server option disables verification;
the client prop alone does not protect the endpoint.

The shared Form retains SvelteKit's native preflight, enhancement, issues, pending
state and success handling. Its reserved `_turnstileToken` field uses native
`fields.as('hidden', token)` naming. Adapters remove it before the business schema
runs, so strict schemas and transformed outputs work without captcha fields.
The leading underscore also prevents SvelteKit from repopulating the token in
HTML after an invalid non-enhanced submission.

Validation-only calls never redeem tokens. Actual submission verifies once with
Cloudflare Siteverify, checking success, expected action and request hostname.
Cloudflare's public passing test secret returns placeholder metadata, so it checks
provider success without matching action or hostname. Real secrets retain both checks.
Missing, invalid, expired or reused tokens produce a native form-wide validation
issue. Provider/configuration failures fail closed with a 503 and use the shared
remote-error toast handling. The widget obtains a fresh token after each server
attempt; client-only field-validation failures keep the unused token.

The script loads only when a protected form mounts, once per page, and widgets
are removed when unmounted. Challenge expiry, script failures and timeouts clear
the token and offer a retry. Each Form keeps its own token. For repeated uses of
the same remote action, use native `form.for(id)` instances as SvelteKit recommends.

Turnstile requires JavaScript. Protected forms fail closed without it. This
template's CSP permits only `https://challenges.cloudflare.com` for the external
script and frame; additional Cloudflare features such as pre-clearance require
reviewing their separate requirements. Configure a trusted external origin/proxy
so `event.url.hostname` matches the hostname on which the widget runs.

## Verification

```sh
bun run test:unit --run --pool threads --configLoader native src/server/turnstile/test
```

Tests use the installed SvelteKit factories and request store, with provider HTTP
responses supplied by test doubles. They do not send secrets or tokens to a live
provider or write todos. Verify a real challenge on each deployment's allowed
hostname before release. Use Cloudflare's documented test keys for local tests,
never a production bypass.

- [SvelteKit remote forms](https://svelte.dev/docs/kit/remote-functions#form)
- [Cloudflare rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare CSP requirements](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)
