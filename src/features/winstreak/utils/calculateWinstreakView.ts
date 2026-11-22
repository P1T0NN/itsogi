// TYPES
import type { WinstreakView } from '../types/winstreakTypes';

export function calculateWinstreakView(streak: number): WinstreakView {
	const prize = Math.floor(streak / 5) * 5;
	const winsToNextBump = 5 - (streak % 5);
	const nextPrize = prize + 5;
	const fullGroups = Math.floor(streak / 5);

	// One group per €5 earned, plus the group currently being filled.
	const groups = Array.from({ length: fullGroups + 1 }, (_, group) =>
		Math.min(5, streak - group * 5)
	);

	return {
		streak,
		prize,
		nextPrize,
		winsToNextBump,
		groups
	};
}
