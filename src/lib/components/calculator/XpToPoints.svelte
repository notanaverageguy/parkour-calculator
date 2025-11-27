<script>
	import { xp_to_points } from '$lib/utils/bidirectional_converting';
	import Input from '../ui/Input.svelte';
	import Output from '../ui/Output.svelte';

	let xp = 0;
</script>

<Input label="Xp" bind:value={xp} />
<Output label="Point Conversion">
	{xp_to_points(xp).toLocaleString()}
</Output>
