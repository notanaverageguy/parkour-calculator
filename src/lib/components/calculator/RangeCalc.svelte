<script>
	import Input from '$lib/components/ui/Input.svelte';
	import { xp_to_points } from '$lib/utils/bidirectional_converting';
	import { calculate_xp_between_levels } from '$lib/utils/level';
	import Output from '../ui/Output.svelte';
	let start_level = 0;
	let end_level = 0;

	$: xp_result = calculate_xp_between_levels(start_level, end_level);
	$: points_result = xp_to_points(xp_result);
</script>

<div>
	<Input label="Start Level" bind:value={start_level} />
</div>

<div class="mt-3 mb-2">
	<Input label="End Level" bind:value={end_level} />
</div>

<Output label="XP Needed">
	{xp_result.toLocaleString()}
</Output>
<Output label="Points Needed">{points_result.toLocaleString()}</Output>
<Output label="Level difference">{end_level - start_level}</Output>
