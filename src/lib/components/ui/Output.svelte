<script>
	export let label = '';
</script>

<div class="my-4 rounded-2xl p-3 dark:bg-gray-950">
	<h2 class="text-xl">{label}</h2>
	<p class="my-3">
		<slot />
	</p>
</div>
