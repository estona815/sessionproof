import type { Conflict, ContributionClaim, Contributor, SourceDocument } from "@/core/schemas";

export const RULE_VERSION = "2026-07-22.1";

type ConflictInput = Omit<Conflict, "conflictId" | "ruleVersion" | "status">;

function conflict(input: ConflictInput): Conflict {
  return {
    ...input,
    conflictId: `conflict_${input.ruleId.toLowerCase()}`,
    ruleVersion: RULE_VERSION,
    status: "OPEN",
  };
}

function claimEvidence(claims: ContributionClaim[], claimIds: string[]) {
  const selected = claims.filter((claim) => claimIds.includes(claim.claimId));
  return {
    claimIds: selected.map((claim) => claim.claimId),
    sourceFragmentIds: [...new Set(selected.map((claim) => claim.sourceFragmentId))],
  };
}

export function compositionTotal(contributors: Contributor[]): number {
  return contributors.reduce(
    (total, contributor) => total + (contributor.compositionSplitBasisPoints ?? 0),
    0,
  );
}

export function masterOwnershipTotal(contributors: Contributor[]): number {
  return contributors.reduce(
    (total, contributor) => total + (contributor.masterOwnershipBasisPoints ?? 0),
    0,
  );
}

export function normalizeContributorName(name: string): string {
  return name
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function duplicateCandidateScore(left: string, right: string): number {
  const a = normalizeContributorName(left);
  const b = normalizeContributorName(right);
  if (a === b) return 1;
  const initialMatch = a.length > 1 && b.length > 1 && a.at(0) === b.at(0);
  const surnameA = left.trim().split(/\s+/).at(-1)?.toLowerCase();
  const surnameB = right.trim().split(/\s+/).at(-1)?.toLowerCase();
  return initialMatch && surnameA === surnameB ? 0.85 : 0;
}

export function detectConflicts(
  contributors: Contributor[],
  claims: ContributionClaim[],
  sources: SourceDocument[],
): Conflict[] {
  const result: Conflict[] = [];
  const composition = compositionTotal(contributors);

  if (composition !== 10000) {
    const evidence = claimEvidence(claims, [
      "claim_nova_composition",
      "claim_jules_composition",
      "claim_sora_composition_25",
    ]);
    result.push(
      conflict({
        ruleId: "RULE_COMPOSITION_SPLIT_TOTAL",
        severity: "BLOCKER",
        title: `Composition split totals ${composition / 100}%`,
        description: `The recorded composition shares total ${composition / 100}%, not 100%.`,
        blocking: true,
        contributorIds: ["contrib_nova", "contrib_jules", "contrib_sora"],
        ...evidence,
        remediation: "Ask the writers to confirm one final set of shares totaling exactly 100%.",
      }),
    );
  }

  const duplicateEvidence = claimEvidence(claims, ["claim_jules_name", "claim_jules_alias"]);
  result.push(
    conflict({
      ruleId: "RULE_CONTRIBUTOR_DUPLICATE",
      severity: "ERROR",
      title: "Likely duplicate: Jules Han / J. Han",
      description: "The same surname and matching initial appear as a name and an alias.",
      blocking: false,
      contributorIds: ["contrib_jules"],
      ...duplicateEvidence,
      remediation: "Ask Jules to approve the alias mapping. Do not merge automatically.",
    }),
  );

  const missingEvidence = claimEvidence(claims, ["claim_lena_name", "claim_lena_role"]);
  result.push(
    conflict({
      ruleId: "RULE_CONTRIBUTOR_MISSING",
      severity: "ERROR",
      title: "Featured vocalist is missing from the credit draft",
      description: "Lena Cho appears in chat and session notes but not in credit_draft_v1.csv.",
      blocking: false,
      contributorIds: ["contrib_lena"],
      ...missingEvidence,
      remediation: "Confirm Lena's preferred display credit and add it to the final ledger.",
    }),
  );

  const percentageEvidence = claimEvidence(claims, [
    "claim_sora_composition_25",
    "claim_sora_composition_20",
  ]);
  result.push(
    conflict({
      ruleId: "RULE_PERCENTAGE_CONFLICT",
      severity: "ERROR",
      title: "Sora Kim has conflicting composition shares",
      description: "The credit draft says 25%, while the session chat says 20%.",
      blocking: false,
      contributorIds: ["contrib_sora"],
      ...percentageEvidence,
      remediation: "Ask Sora and the other writers which value belongs in the final ledger.",
    }),
  );

  const titleEvidence = claimEvidence(claims, ["claim_title_current", "claim_title_old"]);
  result.push(
    conflict({
      ruleId: "RULE_TITLE_CONSISTENCY",
      severity: "ERROR",
      title: "Title mismatch across sources",
      description: "Current metadata says GLASS CITY; the v1 credit draft says CITY OF GLASS.",
      blocking: false,
      contributorIds: [],
      ...titleEvidence,
      remediation: "Confirm the release title and retire the outdated title value.",
    }),
  );

  const roleEvidence = claimEvidence(claims, ["claim_jules_producer", "claim_jules_writer"]);
  result.push(
    conflict({
      ruleId: "RULE_ROLE_CONSISTENCY",
      severity: "WARNING",
      title: "Jules Han's writer role is absent from the v1 credit draft",
      description: "The email says producer and writer, but the old sheet lists producer only.",
      blocking: false,
      contributorIds: ["contrib_jules"],
      ...roleEvidence,
      remediation: "Confirm both roles before export.",
    }),
  );

  const sampleEvidence = claimEvidence(claims, ["claim_sample"]);
  result.push(
    conflict({
      ruleId: "RULE_SAMPLE_MENTION_REVIEW",
      severity: "ERROR",
      title: "Sample mention requires human review",
      description: "An old jazz loop is mentioned, while its review status remains unresolved.",
      blocking: false,
      contributorIds: [],
      ...sampleEvidence,
      remediation: "Route this item to a qualified human reviewer; do not infer clearance.",
    }),
  );

  const contactEvidence = claimEvidence(claims, ["claim_lena_name"]);
  result.push(
    conflict({
      ruleId: "RULE_CONTACT_REQUIRED",
      severity: "WARNING",
      title: "Contributor contact is missing",
      description: "No contact address is available for Lena Cho in the supplied materials.",
      blocking: false,
      contributorIds: ["contrib_lena"],
      ...contactEvidence,
      remediation: "Add a contact address only with the contributor's consent.",
    }),
  );

  const wordingEvidence = claimEvidence(claims, ["claim_theo_name", "claim_theo_role"]);
  result.push(
    conflict({
      ruleId: "RULE_CREDIT_WORDING_REQUIRED",
      severity: "WARNING",
      title: "Theo Lim's display credit is missing",
      description: "The mixing contribution is supported, but final display wording is absent.",
      blocking: false,
      contributorIds: ["contrib_theo"],
      ...wordingEvidence,
      remediation: "Ask Theo to confirm preferred credit wording.",
    }),
  );

  const oldSource = sources.find((source) => source.sourceDocumentId === "src_credit_v1");
  if (oldSource && !oldSource.isLatest) {
    const outdatedEvidence = claimEvidence(claims, ["claim_title_old"]);
    result.push(
      conflict({
        ruleId: "RULE_OUTDATED_SOURCE",
        severity: "WARNING",
        title: "An outdated credit draft is still in the source set",
        description: `${oldSource.filename} is version ${oldSource.version} and not marked current.`,
        blocking: false,
        contributorIds: [],
        ...outdatedEvidence,
        remediation: "Keep it as evidence, but exclude it from final-value precedence.",
      }),
    );
  }

  const splitTypeEvidence = claimEvidence(claims, [
    "claim_nova_composition",
    "claim_nova_master",
    "claim_jules_composition",
    "claim_jules_master",
  ]);
  result.push(
    conflict({
      ruleId: "RULE_SPLIT_TYPE_SEPARATION",
      severity: "ERROR",
      title: "Composition and master ownership are mixed in one table",
      description:
        "The v1 sheet places two different ownership types side by side without approval context.",
      blocking: false,
      contributorIds: ["contrib_nova", "contrib_jules", "contrib_sora"],
      ...splitTypeEvidence,
      remediation: "Review composition and master ownership as separate ledgers.",
    }),
  );

  const confirmationEvidence = claimEvidence(claims, ["claim_unconfirmed"]);
  result.push(
    conflict({
      ruleId: "RULE_UNCONFIRMED_CONTRIBUTOR",
      severity: "WARNING",
      title: "Contributor confirmations are outstanding",
      description: "The final splits have not been acknowledged by all listed contributors.",
      blocking: false,
      contributorIds: ["contrib_nova", "contrib_jules", "contrib_sora"],
      ...confirmationEvidence,
      remediation: "Send private workflow confirmation requests after the open split is corrected.",
    }),
  );

  return result;
}
