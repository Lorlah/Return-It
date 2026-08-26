export interface ConfidenceInputs {
  hasRetailer: boolean;
  hasDeadline: boolean;
  deadlineConfidence: number;
  hasCarrier: boolean;
  hasLabel: boolean;
  hasReference: boolean;
}

// ── Weights ─────────────────────────────────────────────────────────────────

// Weights sum to 1.0.
//
// Deadline is weighted BELOW retailer despite being the more valuable field,
// because many real return emails state no deadline at all — SHEIN's carry
// none, and SHEIN is the most common return email in the test corpus.
// Weighting it like retailer would push every such email under the review
// threshold and bury the queue in false positives. A missing deadline is a
// gap to fill from retailer policy later, not evidence of a bad parse.
const WEIGHTS = {
  retailer: 0.3,
  deadline: 0.2,
  carrier: 0.2,
  label: 0.2,
  reference: 0.1,
} as const;

/** Auto-accept at or above this; below it, ask the user to confirm. */
export const REVIEW_THRESHOLD = 0.7;

export function scoreConfidence(inputs: ConfidenceInputs): number {
  let score = 0;

  if (inputs.hasRetailer) score += WEIGHTS.retailer;
  // The deadline contributes in proportion to how sure we are of it.
  if (inputs.hasDeadline) score += WEIGHTS.deadline * inputs.deadlineConfidence;
  if (inputs.hasCarrier) score += WEIGHTS.carrier;
  if (inputs.hasLabel) score += WEIGHTS.label;
  if (inputs.hasReference) score += WEIGHTS.reference;

  return Math.round(score * 100) / 100;
}
