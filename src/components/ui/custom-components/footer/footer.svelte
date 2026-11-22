<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';

	// CONFIG
	import { COMPANY_DATA } from '@/shared/config';

	// COMPONENTS
	import LanguageSwitcher from '@/components/ui/custom-components/language-switcher/language-switcher.svelte';
</script>

<footer class="border-t border-border bg-background text-foreground">
	<div
		class="mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-6 pb-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10"
	>
		<p class="text-sm text-muted-foreground">
			{m['Footer.copyright']({ name: COMPANY_DATA.NAME })}
		</p>
		<LanguageSwitcher variant="list" />
	</div>
</footer>
