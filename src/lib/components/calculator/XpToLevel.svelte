<script>
	import { xp_to_level } from '$lib/utils/converting_to_levels';
	import Input from '../ui/Input.svelte';
	import Output from '../ui/Output.svelte';

	let xp = 0;
	let start_level = 0;
</script>

<Input label="Start Level" bind:value={start_level} />

<div class="mt-3">
	<Input label="Xp" bind:value={xp} />
</div>

<Output label="Final Level">
	{xp_to_level(start_level, xp).toLocaleString()}
</Output>
