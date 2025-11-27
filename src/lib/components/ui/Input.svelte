<script>
	export let label = '';
	export let value = 0;
</script>

<label>
	<p class="mb-2">{label}</p>
	<input type="number" bind:value class="w-full rounded-md border-none bg-gray-800 py-2 text-lg" />
</label>
