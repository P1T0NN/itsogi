<script lang="ts" generics="Input extends RemoteFormInput | void, Output">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// CONTEXTS
	import { setFormContext } from './formContext';

	// CONFIG
	import { TURNSTILE_CONFIG } from '@/shared/features/turnstile/config';

	// COMPONENTS
	import { toast } from 'svelte-sonner';
	import TurnstileChallenge from '@/features/turnstile/components/turnstile-challenge.svelte';

	// UTILS
	import { handleRemoteFunctionsError } from '@/shared/features/errors/utils/handleRemoteFunctionsError';

	// SCHEMAS
	import { turnstileSubmissionSchema } from '@/shared/features/turnstile/schemas/turnstileSchemas';

	// TYPES
	import type {
		RemoteForm,
		RemoteFormEnhanceInstance,
		RemoteFormInput,
		RemoteFormField
	} from '$app/server';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { TurnstileOptions } from '@/shared/features/turnstile/types/turnstileTypes';

	type Props = Omit<HTMLFormAttributes, 'method' | 'action' | 'onsubmit' | 'children'> & {
		form: RemoteForm<Input, Output>;
		schema: Parameters<RemoteForm<Input, Output>['preflight']>[0];
		onsuccess?: (form: RemoteFormEnhanceInstance<Input, Output>) => void | Promise<void>;
		/** Called when a submission is rejected, e.g. for analytics. Error toasts are already shown. */
		onfailure?: (reason: 'validation' | 'captcha' | 'server') => void;
		children: Snippet;
		actions?: Snippet;
		turnstile?: TurnstileOptions;
	};

	let { form, schema, onsuccess, onfailure, children, actions, turnstile, ...rest }: Props =
		$props();

	const validation = $state({ attempt: 0 });

	setFormContext(validation);

	let token = $state('');
	let challengeAttempt = $state(0);
	let showChallengeError = $state(false);
	let submitting = false;

	// SAFETY: protected server forms accept this reserved transport field separately from the business schema.
	const transportFields = $derived(
		form.fields as typeof form.fields & { _turnstileToken: RemoteFormField<string> }
	);
	const missingChallenge = $derived(turnstile && !token && showChallengeError);
	const rootMessages = $derived([...new Set(form.fields.issues()?.map((issue) => issue.message))]);
	const hasMessages = $derived(missingChallenge || rootMessages.length > 0);

	const validationErrorMessage = m['Validation.correctForm']();

	// Preflight failures skip enhance; notify here and preserve SvelteKit's validation result.
	const handlePreflightValidation: Props['schema']['~standard']['validate'] = async (input) => {
		validation.attempt++;

		let businessInput = input;

		if (turnstile) {
			const submission = turnstileSubmissionSchema.safeParse(input);
			if (submission.success) businessInput = submission.data.input;
		}

		const result = await schema['~standard'].validate(businessInput);

		if (result.issues?.length) {
			toast.error(validationErrorMessage, { id: 'form-validation-error' });
			onfailure?.('validation');
		}

		return result;
	};

	const preflightSchema = $derived({
		'~standard': {
			...schema['~standard'],
			validate: handlePreflightValidation
		}
	});

	async function handleSubmit(instance: RemoteFormEnhanceInstance<Input, Output>) {
		if (submitting) return;

		const needsChallenge = turnstile && !token;

		if (needsChallenge) {
			showChallengeError = true;
			onfailure?.('captcha');
			return;
		}

		submitting = true;

		try {
			const ok = await instance.submit();

			if (!ok) {
				toast.error(validationErrorMessage, { id: 'form-validation-error' });
				onfailure?.('validation');
				return;
			}
		} catch (cause) {
			onfailure?.('server');
			if (!handleRemoteFunctionsError(cause)) throw cause;
			return;
		} finally {
			submitting = false;

			if (turnstile) {
				token = '';
				showChallengeError = false;
				challengeAttempt++;
			}
		}

		await onsuccess?.(instance);
	}
</script>

<form
	{...rest}
	aria-busy={form.pending > 0}
	oninvalidcapture={() => toast.error(validationErrorMessage, { id: 'form-validation-error' })}
	{...form.preflight(preflightSchema).enhance(handleSubmit)}
>
	{@render children()}

	{#if turnstile}
		<input {...transportFields[TURNSTILE_CONFIG.TOKEN_FIELD].as('hidden', token)} />
		{#key challengeAttempt}
			<TurnstileChallenge options={turnstile} bind:token />
		{/key}
	{/if}

	{#if hasMessages}
		<div class="text-sm text-destructive" aria-live="polite">
			{#if missingChallenge}
				<p>{m['Turnstile.required']()}</p>
			{/if}

			{#each rootMessages as message (message)}
				<p>{message}</p>
			{/each}
		</div>
	{/if}

	{@render actions?.()}
</form>
