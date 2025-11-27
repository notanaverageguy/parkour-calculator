<script>
	import { points_to_level } from '$lib/utils/converting_to_levels';
	import Input from '../ui/Input.svelte';
	import Output from '../ui/Output.svelte';

	let points = 0;
	let start_level = 0;
</script>

<Input label="Start Level" bind:value={start_level} />

<div class="mt-3">
	<Input label="Points" bind:value={points} />
</div>

<Output label="Final Level">
	{points_to_level(start_level, points).toLocaleString()}
</Output>
