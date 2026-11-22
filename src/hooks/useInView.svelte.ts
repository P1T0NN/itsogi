/**
 * Flips `inView` to true the first time the attached element scrolls into view, then stops
 * watching. Use it for one-shot entrance animations: `{@attach reveal.attach}` on the element
 * and `reveal.inView` to start the animation.
 *
 * `threshold` is the share of the element (0..1) that must be visible.
 */
export function useInView(threshold = 0.25) {
	let inView = $state(false);

	function attach(node: Element) {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				inView = true;
				observer.disconnect();
			},
			{ threshold }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}

	return {
		get inView() {
			return inView;
		},
		attach
	};
}
