<script lang="ts">
	// LIBRARIES
	import { m } from '@/lib/paraglide/messages';
</script>

<!-- Tape strip across the cage. shortcut: static placeholder until real sponsors sign; bring back the
     scrolling HomeMarqueeItem ticker once there are names to show. -->
<div class="relative z-10 -my-7 overflow-x-clip py-3">
	<div class="-mx-8 -rotate-1 bg-primary py-3 text-center text-primary-foreground shadow-lg">
		<p class="font-heading text-2xl font-black uppercase font-stretch-condensed">
			{m['HomePage.HomeMarqueeSection.sponsorsPlaceholder']()}
		</p>
	</div>
</div>
