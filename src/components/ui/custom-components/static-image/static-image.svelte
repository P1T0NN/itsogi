<script lang="ts">
	import { asset } from '$app/paths';
	import type { HTMLImgAttributes } from 'svelte/elements';

	type Props = Omit<HTMLImgAttributes, 'src'> & {
		/** A file under `static/`; a typo or missing file is a type error. */
		src: Parameters<typeof asset>[0];
	};

	let { src, ...rest }: Props = $props();
</script>

<img {...rest} src={asset(src)} />
