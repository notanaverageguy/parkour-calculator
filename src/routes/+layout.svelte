<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

export const prerender = true; export const trailingSlash = "always";
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
