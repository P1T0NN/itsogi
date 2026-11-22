<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// HELPERS
	import { trackEvent } from '@/features/analytics/helpers/trackEvent';

	// COMPONENTS
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import { Spinner } from '@/components/ui/spinner';
	import { toast } from 'svelte-sonner';
	import Form from '@/components/ui/custom-components/form/form.svelte';
	import FormField from '@/components/ui/custom-components/form/form-field.svelte';

	// REMOTE FUNCTIONS
	import { sendContact } from '@/features/contact/mutations/sendContact.remote';

	// SCHEMAS
	import { contactSchema } from '@/shared/features/contact/schemas/contactSchemas';

	// TYPES
	import type { RemoteFormEnhanceInstance } from '$app/server';

	const name = sendContact.fields.name;
	const email = sendContact.fields.email;
	const message = sendContact.fields.message;

	const pending = $derived(sendContact.pending > 0);

	function handleSent(form: RemoteFormEnhanceInstance) {
		form.element.reset();
		trackEvent('contact_form_sent', {});
		toast.success(m['HomePage.HomeContactForm.sent']());
	}
</script>

<Form
	form={sendContact}
	schema={contactSchema}
	turnstile={{ action: 'sendContact' }}
	onsuccess={handleSent}
	onfailure={(reason) => trackEvent('contact_form_failed', { reason })}
	class="mt-6 flex flex-col gap-5"
>
	<FormField field={name} id="contact-name" label={m['HomePage.HomeContactForm.nameLabel']()}>
		{#snippet children({ control })}
			<Input
				{...name.as('text')}
				{...control}
				autocomplete="name"
				placeholder={m['HomePage.HomeContactForm.namePlaceholder']()}
				maxlength={100}
				readonly={pending}
				class="h-12"
			/>
		{/snippet}
	</FormField>

	<FormField field={email} id="contact-email" label={m['HomePage.HomeContactForm.emailLabel']()}>
		{#snippet children({ control })}
			<Input
				{...email.as('email')}
				{...control}
				autocomplete="email"
				placeholder={m['HomePage.HomeContactForm.emailPlaceholder']()}
				maxlength={254}
				readonly={pending}
				class="h-12"
			/>
		{/snippet}
	</FormField>

	<FormField
		field={message}
		id="contact-message"
		label={m['HomePage.HomeContactForm.messageLabel']()}
		description={m['HomePage.HomeContactForm.messageDescription']()}
	>
		{#snippet children({ control })}
			<Textarea
				{...message.as('text')}
				{...control}
				rows={5}
				placeholder={m['HomePage.HomeContactForm.messagePlaceholder']()}
				class="min-h-36"
				maxlength={2000}
				readonly={pending}
			/>
		{/snippet}
	</FormField>

	{#snippet actions()}
		<Button
			type="submit"
			size="lg"
			disabled={pending}
			class="h-12 w-full rounded-full text-base font-bold sm:w-auto sm:self-start sm:px-8"
		>
			{#if pending}
				<Spinner /> {m['HomePage.HomeContactForm.sending']()}
			{:else}
				{m['HomePage.HomeContactForm.send']()}
			{/if}
		</Button>
	{/snippet}
</Form>
