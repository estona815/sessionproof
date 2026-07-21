import { FixtureAgentTrace } from "@/core/agent-run";
import { buildContributorLedger, buildFixtureClaims } from "@/core/claims";
import { fragmentAllSources } from "@/core/fragments";
import { generateClarificationQuestions } from "@/core/questions";
import { calculateReadiness } from "@/core/readiness";
import { detectConflicts } from "@/core/rules";
import { DemoResultSchema, type DemoResult } from "@/core/schemas";
import { glassCitySources } from "@/data/demo/glass-city";

export function runGlassCityDemo(startedAt = new Date()): DemoResult {
  const trace = new FixtureAgentTrace(startedAt);
  const sources = glassCitySources;
  trace.record(
    "list_documents",
    [],
    sources.map((source) => source.sourceDocumentId),
  );

  const fragments = fragmentAllSources(sources);
  trace.record(
    "fragment_sources",
    sources.map((source) => source.sourceDocumentId),
    fragments.map((fragment) => fragment.fragmentId),
  );

  const claims = buildFixtureClaims(fragments);
  trace.record(
    "submit_structured_claims",
    fragments.map((fragment) => fragment.fragmentId),
    claims.map((claim) => claim.claimId),
  );

  let contributors = buildContributorLedger(claims);
  const conflicts = detectConflicts(contributors, claims, sources);
  contributors = contributors.map((contributor) => ({
    ...contributor,
    conflicts: conflicts
      .filter((item) => item.contributorIds.includes(contributor.contributorId))
      .map((item) => item.conflictId),
    humanReviewRequired: conflicts.some((item) =>
      item.contributorIds.includes(contributor.contributorId),
    ),
  }));
  trace.record(
    "evaluate_deterministic_rules",
    claims.map((claim) => claim.claimId),
    conflicts.map((item) => item.conflictId),
  );

  const readiness = calculateReadiness(conflicts);
  trace.record(
    "calculate_readiness",
    conflicts.map((item) => item.conflictId),
    ["readiness_glass_city"],
  );

  const questions = generateClarificationQuestions(conflicts);
  trace.record(
    "generate_fixture_questions",
    conflicts.map((item) => item.conflictId),
    questions.map((question) => question.questionId),
  );

  return DemoResultSchema.parse({
    schemaVersion: "1.0.0",
    project: {
      projectId: "project_glass_city",
      title: "GLASS CITY",
      artist: "NOVA RHEE",
      mode: "fixture",
    },
    sources,
    fragments,
    claims,
    contributors,
    conflicts,
    readiness,
    questions,
    agentRun: trace.complete(),
  });
}

export function applyDemoConfirmation(
  result: DemoResult,
  contributorId: string,
  action: "CONFIRM" | "DISPUTE" | "PROPOSE_CORRECTION",
): DemoResult {
  const status =
    action === "CONFIRM" ? "CONFIRMED" : action === "DISPUTE" ? "DISPUTED" : "CORRECTION_PROPOSED";
  const contributors = result.contributors.map((contributor) =>
    contributor.contributorId === contributorId
      ? { ...contributor, confirmationStatus: status as typeof contributor.confirmationStatus }
      : contributor,
  );
  return DemoResultSchema.parse({ ...result, contributors });
}
