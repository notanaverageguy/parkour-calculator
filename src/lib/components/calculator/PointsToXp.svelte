<script>
	import { points_to_xp } from '$lib/utils/bidirectional_converting';
	import Input from '../ui/Input.svelte';
	import Output from '../ui/Output.svelte';

	let points = 0;
</script>

<Input label="Points" bind:value={points} />
<Output label="Xp Conversion">
	{points_to_xp(points).toLocaleString()}
</Output>
