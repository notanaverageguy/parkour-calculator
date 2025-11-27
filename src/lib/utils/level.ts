export function calculate_xp_between_levels(start_level: number, end_level: number): number {
	if (end_level < start_level) return -1;
	if (start_level === end_level) return 0;

	if (Math.floor(start_level) === Math.floor(end_level)) {
		return get_xp_within_singular_level(start_level, end_level - start_level);
	}

	let current_level = start_level;
	let total_xp = 0;

	while (Math.floor(current_level) < Math.floor(end_level)) {
		total_xp += get_xp_for_level(current_level);

		current_level++;
	}

	total_xp += get_xp_within_singular_level(end_level, end_level - current_level)
	return total_xp;
}

export function get_xp_within_singular_level(level: number, difference: number): number {
	const level_xp = get_xp_for_level(level);

	return difference * level_xp;

}

export function get_xp_for_level(level: number): number {
	return 300 + 30 * level ** 2;
}

