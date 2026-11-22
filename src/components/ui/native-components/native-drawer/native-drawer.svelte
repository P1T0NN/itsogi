<script lang="ts">
	// UTILS
	import { cn } from '@/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';

	/**
	 * A side drawer on a native modal `<dialog>`, sliding in from the right. The panel sits in a
	 * horizontal scroll-snap scroller, so swiping it away is native scrolling with momentum. The
	 * browser makes the page inert, handles Escape and returns focus to the trigger on close.
	 */
	let {
		label,
		triggerLabel,
		triggerIcon,
		triggerClass,
		class: className,
		children
	}: {
		/** Accessible name of the drawer, e.g. "Menu". */
		label: string;
		/** Accessible name of the icon-only trigger button, e.g. "Open menu". */
		triggerLabel: string;
		/** Iconify class for the trigger, e.g. `icon-[lucide--menu]`. */
		triggerIcon: string;
		triggerClass?: string;
		/** Classes for the sliding panel. */
		class?: string;
		/**
		 * Drawer content. `close` slides the drawer out; `closeNow` closes it instantly, for links that
		 * navigate or scroll the page.
		 */
		children: Snippet<[{ close: () => void; closeNow: () => void }]>;
	} = $props();

	const drawerId = $props.id();

	let dialog = $state<HTMLDialogElement>();
	let scroller = $state<HTMLDivElement>();
	let panel = $state<HTMLElement>();
	let expanded = $state(false);

	async function open() {
		if (!dialog || !scroller) return;
		dialog.showModal();
		expanded = true;

		// Browsers without `scroll-initial-target` would show the panel already open: jump to the
		// closed stop first, wait two frames for it to commit, then slide in.
		const lacksInitialTarget = !CSS.supports('scroll-initial-target', 'nearest');
		if (lacksInitialTarget) {
			scroller.scrollTo({ left: 0, behavior: 'instant' });
			await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		}

		// `auto` follows the CSS scroll-behavior: smooth, unless the user prefers reduced motion.
		scroller.scrollTo({ left: scroller.scrollWidth, behavior: 'auto' });
	}

	// Slide out; the observer below closes the dialog once the panel has left the screen.
	function close() {
		scroller?.scrollTo({ left: 0, behavior: 'auto' });
	}

	function closeNow() {
		dialog?.close();
		scroller?.scrollTo({ left: 0, behavior: 'instant' });
		expanded = false;
	}

	// A tap on the dimmed area (inside the full-screen dialog, outside the panel) closes it.
	function handleDialogClick(event: MouseEvent) {
		const isOutsidePanel = event.target instanceof Node && !panel?.contains(event.target);
		if (isOutsidePanel) close();
	}

	// Escape fires `cancel`; slide out instead of the instant native close when allowed.
	function handleCancel(event: Event) {
		if (!event.cancelable) return;
		event.preventDefault();
		close();
	}

	function handleClose() {
		expanded = false;
	}

	// The panel's visibility inside the dialog is the source of truth for open and closed,
	// whichever way it moved: swipe, button, backdrop tap or Escape.
	function observePanel(node: HTMLElement) {
		const visibleThreshold = 1 / window.innerWidth;
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries.at(-1);
				const hasLeftScreen = entry && entry.intersectionRatio < visibleThreshold;
				if (hasLeftScreen && dialog?.open) dialog.close();
			},
			{ root: dialog, threshold: [visibleThreshold, 1] }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}

	// Without scroll-driven animations, fade the backdrop from a scroll listener instead.
	function fadeBackdropFallback(node: HTMLDivElement) {
		if (CSS.supports('animation-timeline: scroll()')) return;
		const handleScroll = () => {
			const panelWidth = panel?.offsetWidth || 1;
			const ratio = Math.min(1, node.scrollLeft / panelWidth);
			dialog?.style.setProperty('--drawer-backdrop', String(ratio));
		};
		node.addEventListener('scroll', handleScroll, { passive: true });
		return () => node.removeEventListener('scroll', handleScroll);
	}
</script>

<button
	type="button"
	onclick={open}
	aria-label={triggerLabel}
	aria-expanded={expanded}
	aria-controls={drawerId}
	aria-haspopup="dialog"
	class={triggerClass}
>
	<span class="{triggerIcon} size-6" aria-hidden="true"></span>
</button>

<dialog
	bind:this={dialog}
	id={drawerId}
	aria-label={label}
	data-slot="native-drawer"
	class="drawer"
	onclick={handleDialogClick}
	oncancel={handleCancel}
	onclose={handleClose}
>
	<div bind:this={scroller} class="drawer-scroller" {@attach fadeBackdropFallback}>
		<div
			bind:this={panel}
			class={cn('drawer-panel bg-background text-foreground', className)}
			{@attach observePanel}
		>
			{@render children({ close, closeNow })}
		</div>
	</div>
</dialog>

<style>
	.drawer {
		/* Capped on big screens; on phones a strip of the page stays visible to tap outside. */
		--drawer-width: min(24rem, 86dvw, 100dvw - 3rem);
		--drawer-backdrop: 0;

		/* Reset the UA dialog box so the swipe surface covers the whole viewport. */
		inset: 0;
		width: auto;
		height: auto;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		background: transparent;
		border: 0;
		overflow: visible;
	}

	.drawer::backdrop {
		background: black;
		opacity: calc(var(--drawer-backdrop) * 0.6);
	}

	/* Closed stop on the left (empty spacer), open stop on the right (the panel). */
	.drawer-scroller {
		display: grid;
		grid-template-columns: 100% var(--drawer-width);
		height: 100%;
		overflow-x: scroll;
		overscroll-behavior: none;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
	}

	@media (prefers-reduced-motion: no-preference) {
		.drawer-scroller {
			scroll-behavior: smooth;
		}
	}

	.drawer-scroller::before {
		content: '';
		scroll-snap-align: start;
		/* Open the dialog at the closed stop so the panel slides in. */
		scroll-initial-target: nearest;
	}

	.drawer-panel {
		/* svh, not dvh: the panel must not jump while the mobile address bar resizes mid-swipe. */
		height: 100svh;
		overflow-y: auto;
		overscroll-behavior: contain;
		scroll-snap-align: end;
		scrollbar-width: none;
	}

	/* The backdrop follows the swipe. Gated: without support the keyframes would pin it opaque. */
	@supports (animation-timeline: scroll()) {
		.drawer {
			timeline-scope: --drawer-fade;
			animation: drawer-backdrop-fade linear both;
			animation-timeline: --drawer-fade;
		}

		.drawer-scroller {
			scroll-timeline: --drawer-fade x;
		}

		@property --drawer-backdrop {
			syntax: '<number>';
			inherits: true;
			initial-value: 0;
		}

		@keyframes drawer-backdrop-fade {
			0% {
				--drawer-backdrop: 0;
			}
			100% {
				--drawer-backdrop: 1;
			}
		}
	}

	/* Lock page scrolling while the drawer is open. */
	:global(html:has(dialog[data-slot='native-drawer']:modal)),
	:global(body:has(dialog[data-slot='native-drawer']:modal)) {
		overflow: hidden;
	}
</style>
