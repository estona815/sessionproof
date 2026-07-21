import type { Conflict, ConflictSeverity, ReadinessResult } from "@/core/schemas";

export const READINESS_POLICY = {
  version: "2026-07-22.1",
  deductions: {
    BLOCKER: 30,
    ERROR: 7,
    WARNING: 2,
    INFO: 0,
  } satisfies Record<ConflictSeverity, number>,
} as const;

export function calculateReadiness(conflicts: Conflict[]): ReadinessResult {
  const open = conflicts.filter((item) => item.status === "OPEN");
  const conflictCounts: Record<ConflictSeverity, number> = {
    INFO: 0,
    WARNING: 0,
    ERROR: 0,
    BLOCKER: 0,
  };
  open.forEach((item) => {
    conflictCounts[item.severity] += 1;
  });

  const deduction = open.reduce(
    (total, item) => total + READINESS_POLICY.deductions[item.severity],
    0,
  );
  const score = Math.max(0, 100 - deduction);

  let status: ReadinessResult["status"] = "READY";
  if (conflictCounts.BLOCKER > 0) status = "BLOCKED";
  else if (conflictCounts.ERROR > 0) status = "REVIEW_REQUIRED";
  else if (conflictCounts.WARNING > 0) status = "READY_WITH_WARNINGS";

  return {
    score,
    status,
    conflictCounts,
    policyVersion: READINESS_POLICY.version,
    explanation: [
      `Start at 100; subtract ${READINESS_POLICY.deductions.BLOCKER} per blocker, ${READINESS_POLICY.deductions.ERROR} per error, and ${READINESS_POLICY.deductions.WARNING} per warning.`,
      `${conflictCounts.BLOCKER} blocker(s), ${conflictCounts.ERROR} error(s), and ${conflictCounts.WARNING} warning(s) remain open.`,
      "This is an internal workflow state, not an industry certification or legal conclusion.",
    ],
  };
}
