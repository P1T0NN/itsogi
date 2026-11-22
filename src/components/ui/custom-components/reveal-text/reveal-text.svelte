<script lang="ts">
	// HOOKS
	import { useInView } from '@/hooks/useInView.svelte';

	let {
		text,
		offset = 0,
		class: className
	}: {
		text: string;
		/** Letters already revealed before this text starts, to chain several pieces in one line. */
		offset?: number;
		class?: string;
	} = $props();

	const STAGGER_MS = 35;

	const reveal = useInView();

	// Letters are grouped per word so lines still wrap between words, never mid-word.
	const words = $derived.by(() => {
		let index = offset;
		return text.split(' ').map((word) => [...word].map((char) => ({ char, index: index++ })));
	});
</script>

<!-- Types the text in letter by letter, once, when it scrolls into view. -->
<span class={className} {@attach reveal.attach}>
	<span class="sr-only">{text}</span>
	<span aria-hidden="true" class:in-view={reveal.inView}>
		{#each words as letters, wordIndex (wordIndex)}
			{#if wordIndex > 0}{' '}{/if}<span class="inline-block whitespace-nowrap"
				>{#each letters as letter (letter.index)}<span
						class="letter inline-block"
						style:animation-delay="{letter.index * STAGGER_MS}ms">{letter.char}</span
					>{/each}</span
			>
		{/each}
	</span>
</span>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.letter {
			opacity: 0;
			transform: translateY(0.25em);
		}

		.in-view .letter {
			animation: letter 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
	}

	@keyframes letter {
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
