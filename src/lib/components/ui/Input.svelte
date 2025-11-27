<script lang="ts">
	export let label = '';
	export let value = 0;

	let displayValue = value.toLocaleString();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;

		const raw = target.value.replace(/,/g, '');

		const num = Number(raw);
		if (!Number.isNaN(num)) {
			value = num;
			displayValue = target.value;
		}
	}

	$: displayValue = value.toLocaleString();
</script>

<label>
	<p class="mb-2">{label}</p>
	<input
		type="text"
		class="w-full rounded-md border-none bg-gray-800 py-2 text-lg"
		bind:value={displayValue}
		on:input={handleInput}
	/>
</label>
