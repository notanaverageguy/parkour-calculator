import { points_to_xp } from "./bidirectional_converting";
import { calculate_xp_between_levels, get_xp_for_level } from "./level";

export function xp_to_level(start_level: number, xp: number): number {
	let xp_to_next_level = calculate_xp_between_levels(start_level, Math.floor(start_level + 1))

	while (xp > xp_to_next_level) {
		xp -= xp_to_next_level;

		start_level = Math.floor(start_level + 1);

		xp_to_next_level = calculate_xp_between_levels(start_level, Math.floor(start_level + 1))

	}

	return xp / get_xp_for_level(start_level) + start_level;
}
export function points_to_level(start_level: number, points: number): number {
	const xp = points_to_xp(points);
	return xp_to_level(start_level, xp);
}
