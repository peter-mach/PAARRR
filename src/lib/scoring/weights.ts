/**
 * Scoring dimension weights. Justification lives in README ("Scoring weights").
 * Sum must equal 1.
 */
export const SCORING_WEIGHTS = {
  impact: 0.35,
  aiLeverage: 0.45,
  quality: 0.2,
} as const;

export function weightedTotal(input: {
  impact: number;
  aiLeverage: number;
  quality: number;
}): number {
  const total =
    input.impact * SCORING_WEIGHTS.impact +
    input.aiLeverage * SCORING_WEIGHTS.aiLeverage +
    input.quality * SCORING_WEIGHTS.quality;
  return Math.round(total);
}
