// CONFIG
import { FEATURED_VIDEOS } from '@/shared/config';

// HOOKS
import { useInView } from '@/hooks/useInView.svelte';

// TYPES
import type { CarouselAPI, CarouselOptions } from '@/components/ui/carousel/context';

export function useReelCarousel() {
	// Fan geometry per slide of distance from the center card (matches a 7-card fan at ±3).
	const ROTATION_PER_SLIDE = 7;
	const SCALE_FALLOFF = 0.025;
	const DROP_REM = 0.8;
	const MAX_DISTANCE = 3.5;

	// Deck pose before the deal: cards squared up in the middle, nudged and tilted a little each.
	const DECK_NUDGE_PX = 6;
	const DECK_TILT = 1.5;
	const DECK_SCALE = 0.94;
	// The deal: every card slides into the fan once, outer cards a beat after inner ones.
	const DEAL_DURATION_MS = 900;
	const DEAL_STAGGER_MS = 70;
	const DEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

	// Start on the middle card so the fan opens to both sides.
	const startIndex = FEATURED_VIDEOS.length >> 1;
	const options: CarouselOptions = {
		loop: true,
		align: 'center',
		containScroll: false,
		startIndex
	};

	let api = $state<CarouselAPI>();
	let selectedIndex = $state(startIndex);
	// Plain flag, not state: applyFan reads it on every scroll frame and must not become reactive.
	let dealt = false;

	const reveal = useInView(0.3);

	function applyFan(carousel: CarouselAPI, eventName?: string) {
		const engine = carousel.internalEngine();
		const progress = carousel.scrollProgress();
		const snaps = carousel.scrollSnapList();
		const slides = carousel.slideNodes();
		const inView = carousel.slidesInView();
		const isScrollEvent = eventName === 'scroll';

		snaps.forEach((snap, snapIndex) => {
			engine.slideRegistry[snapIndex].forEach((slideIndex) => {
				const isOffscreenDuringScroll = isScrollEvent && !inView.includes(slideIndex);
				if (isOffscreenDuringScroll) return;

				let diff = snap - progress;

				// Looped slides sit on the other side of the track; measure them the short way round.
				if (engine.options.loop) {
					engine.slideLooper.loopPoints.forEach((loopPoint) => {
						const target = loopPoint.target();
						const isLoopedSlide = slideIndex === loopPoint.index && target !== 0;
						if (!isLoopedSlide) return;
						diff = Math.sign(target) === -1 ? snap - (1 + progress) : snap + (1 - progress);
					});
				}

				const distance = diff * snaps.length;
				const clamped = Math.max(-MAX_DISTANCE, Math.min(MAX_DISTANCE, distance));
				const away = Math.abs(clamped);
				const opacity = away > 3 ? Math.max(0, 1 - (away - 3) * 2) : 1;

				const slide = slides[slideIndex];
				const card = slide.querySelector<HTMLElement>('[data-fan-card]');
				// Embla owns the slide's transform, so the fan pose goes on the card inside it.
				slide.style.zIndex = String(Math.round(100 - away * 10));
				if (!card) return;
				const fanPose = `translateY(${clamped * clamped * DROP_REM}rem) rotate(${clamped * ROTATION_PER_SLIDE}deg) scale(${1 - SCALE_FALLOFF * clamped * clamped})`;
				// Pull each card back over the center card by its own distance to stack the deck.
				const deckPose = `translateX(${-clamped * (slide.offsetWidth - DECK_NUDGE_PX)}px) rotate(${clamped * DECK_TILT}deg) scale(${DECK_SCALE})`;
				card.style.transform = dealt ? fanPose : deckPose;
				card.style.opacity = String(opacity);
				card.dataset.away = String(away);
			});
		});
	}

	function updateSelected(carousel: CarouselAPI) {
		selectedIndex = carousel.selectedScrollSnap();
	}

	function setApi(carousel: CarouselAPI | undefined) {
		api = carousel;
	}

	function scrollTo(index: number) {
		api?.scrollTo(index);
	}

	function scrollPrev() {
		api?.scrollPrev();
	}

	function scrollNext() {
		api?.scrollNext();
	}

	function deal(carousel: CarouselAPI) {
		dealt = true;

		for (const slide of carousel.slideNodes()) {
			const card = slide.querySelector<HTMLElement>('[data-fan-card]');
			if (!card) continue;

			const delay = Number(card.dataset.away ?? 0) * DEAL_STAGGER_MS;
			card.style.transition = `transform ${DEAL_DURATION_MS}ms ${DEAL_EASE} ${delay}ms`;
			// Once in the fan, drop the transition so dragging tracks the finger instantly again.
			card.addEventListener('transitionend', () => (card.style.transition = ''), { once: true });
		}

		applyFan(carousel);
	}

	$effect(() => {
		if (!api) return;
		const carousel = api;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) dealt = true;

		applyFan(carousel);
		updateSelected(carousel);
		carousel.on('scroll', applyFan).on('reInit', applyFan).on('slideFocus', applyFan);
		carousel.on('select', updateSelected);

		return () => {
			carousel.off('scroll', applyFan).off('reInit', applyFan).off('slideFocus', applyFan);
			carousel.off('select', updateSelected);
		};
	});

	$effect(() => {
		const carousel = api;
		const readyToDeal = carousel !== undefined && reveal.inView && !dealt;
		if (readyToDeal) deal(carousel);
	});

	return {
		get selectedIndex() {
			return selectedIndex;
		},
		options,
		setApi,
		attach: reveal.attach,
		scrollTo,
		scrollPrev,
		scrollNext
	};
}
