/**
 * UoM Score Formula Engine
 * Implements BRD-mandated calculation modes for each goal type.
 */

export type UomType = "min" | "max" | "timeline" | "zero";

export interface UomScoreInput {
  uomType: UomType;
  target: number;
  actual: number;
  /** For timeline type: deadline date string (ISO) */
  deadlineDate?: string;
  /** For timeline type: start date string (ISO) */
  startDate?: string;
}

/**
 * Compute goal score (0–100%) based on UoM type.
 *
 * | UoM Type | Formula                         |
 * |----------|---------------------------------|
 * | min      | actual / target * 100           | (higher is better — e.g. revenue)
 * | max      | target / actual * 100           | (lower is better — e.g. bug count)
 * | timeline | days_remaining / total_days * 100 | (completion date vs deadline)
 * | zero     | actual === 0 → 100, else 0      | (e.g. safety incidents)
 */
export function computeUomScore(input: UomScoreInput): number {
  const { uomType, target, actual } = input;

  if (uomType === "min") {
    if (target <= 0) return 0;
    return Math.min(100, Math.round((actual / target) * 100));
  }

  if (uomType === "max") {
    if (actual <= 0) return 100; // achieved zero — perfect
    return Math.min(100, Math.round((target / actual) * 100));
  }

  if (uomType === "zero") {
    return actual === 0 ? 100 : 0;
  }

  if (uomType === "timeline") {
    if (!input.startDate || !input.deadlineDate) return 0;
    const start = new Date(input.startDate).getTime();
    const deadline = new Date(input.deadlineDate).getTime();
    const now = Date.now();
    const totalDays = deadline - start;
    if (totalDays <= 0) return 0;
    const daysRemaining = deadline - now;
    const pct = Math.round((daysRemaining / totalDays) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  return 0;
}

/** Human-readable label for each UoM type */
export const UOM_LABELS: Record<UomType, string> = {
  min: "Min (↑ higher = better)",
  max: "Max (↓ lower = better)",
  timeline: "Timeline",
  zero: "Zero (binary)",
};

/** Short badge label */
export const UOM_SHORT: Record<UomType, string> = {
  min: "MIN",
  max: "MAX",
  timeline: "DATE",
  zero: "ZERO",
};

/**
 * Compute weighted overall score across all goals.
 * Returns value 0–100.
 */
export function computeWeightedScore(
  goals: Array<{ score: number; weightage: number }>
): number {
  const totalWeight = goals.reduce((s, g) => s + g.weightage, 0);
  if (totalWeight === 0) return 0;
  const weighted = goals.reduce((s, g) => s + (g.score * g.weightage) / 100, 0);
  return Math.round((weighted / totalWeight) * 100);
}

/** Validate weightage rules, returns array of error strings */
export function validateGoalSheet(
  goals: Array<{ title: string; weightage: number; index: number }>
): string[] {
  const errors: string[] = [];
  const total = goals.reduce((s, g) => s + g.weightage, 0);

  if (total !== 100) {
    const diff = 100 - total;
    if (diff > 0) {
      errors.push(`Your total weightage is ${total}%. Add ${diff}% more to submit.`);
    } else {
      errors.push(`Your total weightage is ${total}%. Remove ${Math.abs(diff)}% to submit.`);
    }
  }

  goals.forEach(g => {
    if (g.weightage > 0 && g.weightage < 10) {
      errors.push(`Goal #${g.index + 1} "${g.title || "Untitled"}" is below the 10% minimum. Adjust before submitting.`);
    }
  });

  if (goals.length > 8) {
    errors.push(`You've reached the 8-goal limit. Remove a goal to add a new one.`);
  }

  return errors;
}
