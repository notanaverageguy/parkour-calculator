<script lang="ts">
	export let on: boolean = false;
	export let hover: string = '';

	let show = false;

	function toggle() {
		on = !on;
	}
</script>

<div class="relative inline-block">
	<button
		class={`m-0.5 cursor-pointer rounded-lg px-5 py-2 text-base text-white
		        transition-all duration-150 active:scale-95
		        ${on ? 'bg-green-800' : 'bg-neutral-800'}`}
		on:click={toggle}
		on:mouseenter={() => (show = true)}
		on:mouseleave={() => (show = false)}
	>
		<slot />
	</button>

	{#if hover}
		<div
			class={`pointer-events-none absolute bottom-[120%] left-1/2
			        -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs
			        whitespace-nowrap text-white
			        transition-opacity duration-150
			        ${show ? 'opacity-100' : 'opacity-0'}`}
		>
			{hover}
		</div>
	{/if}
</div>
