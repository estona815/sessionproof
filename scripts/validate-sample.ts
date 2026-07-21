import expectedClaims from "../samples/glass-city/expected-claims.json";
import expectedConflicts from "../samples/glass-city/expected-conflicts.json";

import { runGlassCityDemo } from "@/core/demo";

const result = runGlassCityDemo(new Date("2026-07-22T01:00:00.000Z"));
const missingClaims = expectedClaims.requiredClaimIds.filter(
  (claimId) => !result.claims.some((claim) => claim.claimId === claimId),
);
const missingRules = expectedConflicts.requiredRuleIds.filter(
  (ruleId) => !result.conflicts.some((conflict) => conflict.ruleId === ruleId),
);

const failures = [
  result.claims.length === expectedClaims.expectedClaimCount
    ? null
    : `Expected ${expectedClaims.expectedClaimCount} claims, found ${result.claims.length}`,
  result.conflicts.length === expectedConflicts.expectedConflictCount
    ? null
    : `Expected ${expectedConflicts.expectedConflictCount} conflicts, found ${result.conflicts.length}`,
  result.readiness.score === expectedConflicts.expectedReadiness.score
    ? null
    : `Expected score ${expectedConflicts.expectedReadiness.score}, found ${result.readiness.score}`,
  result.readiness.status === expectedConflicts.expectedReadiness.status
    ? null
    : `Expected status ${expectedConflicts.expectedReadiness.status}, found ${result.readiness.status}`,
  missingClaims.length ? `Missing claims: ${missingClaims.join(", ")}` : null,
  missingRules.length ? `Missing rules: ${missingRules.join(", ")}` : null,
].filter(Boolean);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `PASS ${result.sources.length} sources → ${result.fragments.length} fragments → ${result.claims.length} supported claims → ${result.conflicts.length} conflicts → ${result.readiness.score}/100 ${result.readiness.status}`,
  );
}
