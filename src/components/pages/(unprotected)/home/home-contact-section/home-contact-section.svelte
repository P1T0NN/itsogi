<script lang="ts">
	// COMPONENTS
	import AngledEdge from '@/components/ui/custom-components/design-elements/angled-edge.svelte';
	import HomeContactSectionLeftContent from './home-contact-section-left-content.svelte';
	import HomeContactSectionRightContent from './home-contact-section-right-content.svelte';
</script>

<section
	id="collabs"
	class="relative isolate scroll-mt-20 overflow-hidden bg-background text-foreground"
>
	<AngledEdge dip="right" class="text-secondary" />
	<div class="mx-auto max-w-7xl px-4 pt-24 pb-24 sm:px-6 lg:px-10 lg:pt-32">
		<div class="grid gap-14 lg:grid-cols-2 lg:gap-16">
			<HomeContactSectionLeftContent />
			<HomeContactSectionRightContent />
		</div>
	</div>
</section>
