<script>
	export let section_name = '';
</script>

<div
	class="m-2 w-auto rounded-2xl border border-black p-4 duration-500 hover:border-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
>
	<h3 class="mt-3 mb-4 text-xl">{section_name}</h3>
	<slot />
</div>
