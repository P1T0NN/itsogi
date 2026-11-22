<script lang="ts">
	// CONTEXTS
	import { useFormContext } from './formContext';

	// COMPONENTS
	import { Label } from '@/components/ui/label';

	// TYPES
	import type { RemoteFormIssue } from '$app/server';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		field: { issues(): RemoteFormIssue[] | undefined };
		id: string;
		label: string;
		description?: string;
		children: Snippet<
			[
				{
					control: Pick<HTMLAttributes<HTMLElement>, 'id' | 'aria-invalid' | 'aria-describedby'> & {
						oninput: () => void;
						onchange: () => void;
					};
					clearErrors: () => void;
				}
			]
		>;
	};

	let { field, id, label, description, children }: Props = $props();

	const validation = useFormContext();

	let editedAttempt = $state<number | null>(null);

	const issues = $derived(editedAttempt === validation.attempt ? [] : (field.issues() ?? []));
	const errorId = $derived(`${id}-errors`);
	const descriptionId = $derived(`${id}-description`);

	const control = $derived({
		id,
		'aria-invalid': issues.length > 0,
		'aria-describedby': description ? `${descriptionId} ${errorId}` : errorId,
		oninput: clearErrors,
		onchange: clearErrors
	});

	function clearErrors() {
		editedAttempt = validation.attempt;
	}
</script>

<div class="flex flex-col gap-2" data-invalid={issues.length > 0 || undefined}>
	<Label for={id}>{label}</Label>

	{@render children({ control, clearErrors })}

	{#if description}
		<p id={descriptionId} class="text-sm text-muted-foreground">{description}</p>
	{/if}

	<div id={errorId} class="text-sm text-destructive" aria-live="polite">
		{#each issues as issue (issue.message)}
			<p>{issue.message}</p>
		{/each}
	</div>
</div>
