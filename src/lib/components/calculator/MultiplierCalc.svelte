<script lang="ts">
	import MultiplierButton from '../ui/MultiplierButton.svelte';
	import Input from '../ui/Input.svelte';
	import Output from '../ui/Output.svelte';

	let is_weekend = false;
	let is_night = false;
	let is_halloween = false;
	let in_group = false;
	let in_ranked = false;
	let robux_points_gamepass = false;
	let hardcore_mode = false;

	let highest_elo = 0;
	let playtime_multiplier = 1;
	let robux_multiplier = 0;

	const boost = (condition: boolean, value: number) => (condition ? value : 0);

	$: final_multiplier = (() => {
		let multiplier = 1;

		multiplier += boost(is_weekend, 0.2);
		multiplier += boost(is_night, 0.2);
		multiplier += boost(is_halloween, 1);
		multiplier += boost(in_group, 0.2);
		multiplier += boost(in_ranked, 0.5);

		multiplier += (highest_elo / 3100) * 0.35;
		multiplier += robux_multiplier;

		multiplier *= playtime_multiplier;

		if (robux_points_gamepass) {
			multiplier *= 1.5;
		}

		if (hardcore_mode) {
			multiplier *= 4;
		}

		return multiplier;
	})();
</script>

<div>
	<MultiplierButton bind:on={is_weekend} hover="+0.2">Is weekend</MultiplierButton>
	<MultiplierButton bind:on={is_night} hover="+0.2">Is night</MultiplierButton>
	<MultiplierButton bind:on={is_halloween} hover="+1">Is Halloween</MultiplierButton>
	<MultiplierButton bind:on={in_group} hover="+0.2">In group</MultiplierButton>
	<MultiplierButton bind:on={in_ranked} hover="+0.5">In ranked</MultiplierButton>
	<MultiplierButton bind:on={robux_points_gamepass} hover="1.5x">1.5x Gamepass</MultiplierButton>
	<MultiplierButton bind:on={hardcore_mode} hover="4x">Hardcore mode</MultiplierButton>
</div>

<div class="mt-3 mb-2">
	<Input label="Highest Elo" bind:value={highest_elo} />
</div>

<div class="mt-3 mb-2">
	<Input label="Playtime Multiplier" bind:value={playtime_multiplier} />
</div>

<div class="mt-3 mb-2">
	<Input label="Robux Multiplier" bind:value={robux_multiplier} />
</div>

<Output label="Final Multiplier">
	{final_multiplier.toFixed(2)}
</Output>
