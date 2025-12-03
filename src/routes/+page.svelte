<script>
	import RangeCalc from '$lib/components/calculator/RangeCalc.svelte';
	import MultiplierCalc from '$lib/components/calculator/MultiplierCalc.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import MetaBalls from '$lib/components/ui/MetaBalls.svelte';
	import PointsToXp from '$lib/components/calculator/PointsToXp.svelte';
	import XpToPoints from '$lib/components/calculator/XpToPoints.svelte';
	import XpToLevel from '$lib/components/calculator/XpToLevel.svelte';
	import PointsToLevel from '$lib/components/calculator/PointsToLevel.svelte';
</script>

<svelte:head>
	<title>Parkour Calculator</title>
</svelte:head>

<div class="flex justify-center">
	<MetaBalls />
	<div class="inline-grid xl:max-w-9/12 xl:grid-cols-2">
		<Section section_name="Level Range">
			<RangeCalc />
		</Section>

		<Section section_name="Multiplier Calc">
			<MultiplierCalc />
		</Section>

		<Section section_name="Points To Levels">
			<PointsToLevel />
		</Section>

		<Section section_name="Xp To Levels">
			<XpToLevel />
		</Section>

		<Section section_name="Points To Xp">
			<PointsToXp />
		</Section>

		<Section section_name="Xp To Points">
			<XpToPoints />
		</Section>
		<div class="col-span-2 text-center">
			<p>I hate mae</p>
		</div>
	</div>
</div>
<div class="h-dvh"></div>
