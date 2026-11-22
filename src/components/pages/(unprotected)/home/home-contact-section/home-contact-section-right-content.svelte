<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// COMPONENTS
	import GoalNet from '@/components/ui/custom-components/design-elements/goal-net.svelte';
	import HomeContactForm from './home-contact-form.svelte';
</script>

<!-- The form sits inside a chalk goal: shoot your shot. -->
<div class="relative isolate min-w-0 px-3 pt-8 sm:px-14 sm:pt-16 sm:pb-10">
	<GoalNet class="inset-0 -z-10 size-full" />

	<div class="rounded-3xl border border-border bg-card p-4 sm:p-8">
		<h3 class="font-heading text-3xl leading-none font-extrabold uppercase font-stretch-condensed">
			{m['HomePage.HomeContactSectionRightContent.title']()}
		</h3>

		<HomeContactForm />
	</div>
</div>
