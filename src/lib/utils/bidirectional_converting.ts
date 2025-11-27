const XP_POWER = 1.0501716659439975;

export function points_to_xp(points: number): number {
	return 0.5 * Math.pow(points, XP_POWER);
}

export function xp_to_points(xp: number): number {
	return Math.pow(2 * xp, 1 / XP_POWER);
}
