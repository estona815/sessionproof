import type { ContributionClaim, Contributor, OwnershipType, SourceFragment } from "@/core/schemas";

const RUN_ID = "run_fixture_glass_city_v1";
const MODEL_VERSION = "fixture/glass-city-v1";

type FixtureClaimInput = Omit<
  ContributionClaim,
  | "sourceFragmentId"
  | "sourceQuote"
  | "confidence"
  | "modelVersion"
  | "extractionRunId"
  | "schemaVersion"
> & {
  sourceDocumentId: string;
  quote: string;
  confidence?: number;
};

function locateFragment(fragments: SourceFragment[], sourceDocumentId: string, quote: string) {
  const fragment = fragments.find(
    (candidate) =>
      candidate.sourceDocumentId === sourceDocumentId && candidate.text.includes(quote),
  );
  if (!fragment) {
    throw new Error(`Fixture evidence not found for ${sourceDocumentId}: ${quote}`);
  }
  return fragment;
}

export function validateClaimEvidence(
  claim: ContributionClaim,
  fragments: SourceFragment[],
): boolean {
  const fragment = fragments.find((item) => item.fragmentId === claim.sourceFragmentId);
  return Boolean(fragment?.text.includes(claim.sourceQuote));
}

export function rejectUnsupportedClaims(
  claims: ContributionClaim[],
  fragments: SourceFragment[],
): ContributionClaim[] {
  return claims.filter((claim) => validateClaimEvidence(claim, fragments));
}

export function buildFixtureClaims(fragments: SourceFragment[]): ContributionClaim[] {
  const inputs: FixtureClaimInput[] = [
    {
      claimId: "claim_nova_name",
      contributorCandidate: "Nova Rhee",
      claimType: "CONTRIBUTOR_NAME",
      value: "Nova Rhee",
      sourceDocumentId: "src_credit_v1",
      quote: "Nova Rhee",
    },
    {
      claimId: "claim_nova_role",
      contributorCandidate: "Nova Rhee",
      claimType: "ROLE",
      value: "writer",
      sourceDocumentId: "src_credit_v1",
      quote: "writer",
    },
    {
      claimId: "claim_nova_composition",
      contributorCandidate: "Nova Rhee",
      claimType: "PERCENTAGE",
      value: { basisPoints: 5000, ownershipType: "COMPOSITION" },
      sourceDocumentId: "src_credit_v1",
      quote: "50%",
    },
    {
      claimId: "claim_nova_master",
      contributorCandidate: "Nova Rhee",
      claimType: "PERCENTAGE",
      value: { basisPoints: 5000, ownershipType: "MASTER" },
      sourceDocumentId: "src_credit_v1",
      quote: "50%,50%",
    },
    {
      claimId: "claim_jules_name",
      contributorCandidate: "Jules Han",
      claimType: "CONTRIBUTOR_NAME",
      value: "Jules Han",
      sourceDocumentId: "src_credit_v1",
      quote: "Jules Han",
    },
    {
      claimId: "claim_jules_alias",
      contributorCandidate: "Jules Han",
      claimType: "ALIAS",
      value: "J. Han",
      sourceDocumentId: "src_chat",
      quote: "J. Han",
    },
    {
      claimId: "claim_jules_producer",
      contributorCandidate: "Jules Han",
      claimType: "ROLE",
      value: "producer",
      sourceDocumentId: "src_credit_v1",
      quote: "producer",
    },
    {
      claimId: "claim_jules_writer",
      contributorCandidate: "Jules Han",
      claimType: "ROLE",
      value: "writer",
      sourceDocumentId: "src_email",
      quote: "producer and writer",
    },
    {
      claimId: "claim_jules_composition",
      contributorCandidate: "Jules Han",
      claimType: "PERCENTAGE",
      value: { basisPoints: 3500, ownershipType: "COMPOSITION" },
      sourceDocumentId: "src_credit_v1",
      quote: "35%",
    },
    {
      claimId: "claim_jules_master",
      contributorCandidate: "Jules Han",
      claimType: "PERCENTAGE",
      value: { basisPoints: 3000, ownershipType: "MASTER" },
      sourceDocumentId: "src_credit_v1",
      quote: "35%,30%",
    },
    {
      claimId: "claim_jules_wording",
      contributorCandidate: "Jules Han",
      claimType: "CREDIT_WORDING",
      value: "Produced by Jules Han",
      sourceDocumentId: "src_email",
      quote: "Produced by Jules Han",
    },
    {
      claimId: "claim_sora_name",
      contributorCandidate: "Sora Kim",
      claimType: "CONTRIBUTOR_NAME",
      value: "Sora Kim",
      sourceDocumentId: "src_credit_v1",
      quote: "Sora Kim",
    },
    {
      claimId: "claim_sora_role",
      contributorCandidate: "Sora Kim",
      claimType: "ROLE",
      value: "writer",
      sourceDocumentId: "src_credit_v1",
      quote: "writer",
    },
    {
      claimId: "claim_sora_composition_25",
      contributorCandidate: "Sora Kim",
      claimType: "PERCENTAGE",
      value: { basisPoints: 2500, ownershipType: "COMPOSITION" },
      sourceDocumentId: "src_credit_v1",
      quote: "25%",
    },
    {
      claimId: "claim_sora_composition_20",
      contributorCandidate: "Sora Kim",
      claimType: "PERCENTAGE",
      value: { basisPoints: 2000, ownershipType: "COMPOSITION" },
      sourceDocumentId: "src_chat",
      quote: "composition share was 20%",
      confidence: 0.95,
    },
    {
      claimId: "claim_sora_master",
      contributorCandidate: "Sora Kim",
      claimType: "PERCENTAGE",
      value: { basisPoints: 2000, ownershipType: "MASTER" },
      sourceDocumentId: "src_credit_v1",
      quote: "25%,20%",
    },
    {
      claimId: "claim_lena_name",
      contributorCandidate: "Lena Cho",
      claimType: "CONTRIBUTOR_NAME",
      value: "Lena Cho",
      sourceDocumentId: "src_chat",
      quote: "Lena Cho",
    },
    {
      claimId: "claim_lena_role",
      contributorCandidate: "Lena Cho",
      claimType: "ROLE",
      value: "featured vocalist",
      sourceDocumentId: "src_notes",
      quote: "Featured vocal recorded by Lena Cho",
    },
    {
      claimId: "claim_theo_name",
      contributorCandidate: "Theo Lim",
      claimType: "CONTRIBUTOR_NAME",
      value: "Theo Lim",
      sourceDocumentId: "src_invoice",
      quote: "Theo Lim",
    },
    {
      claimId: "claim_theo_role",
      contributorCandidate: "Theo Lim",
      claimType: "ROLE",
      value: "mixing engineer",
      sourceDocumentId: "src_notes",
      quote: "completed the mix",
    },
    {
      claimId: "claim_title_current",
      contributorCandidate: null,
      claimType: "WORK_TITLE",
      value: "GLASS CITY",
      sourceDocumentId: "src_metadata",
      quote: "GLASS CITY",
    },
    {
      claimId: "claim_title_old",
      contributorCandidate: null,
      claimType: "WORK_TITLE",
      value: "CITY OF GLASS",
      sourceDocumentId: "src_credit_v1",
      quote: "CITY OF GLASS",
    },
    {
      claimId: "claim_artist",
      contributorCandidate: "Nova Rhee",
      claimType: "ARTIST_NAME",
      value: "NOVA RHEE",
      sourceDocumentId: "src_metadata",
      quote: "NOVA RHEE",
    },
    {
      claimId: "claim_sample",
      contributorCandidate: null,
      claimType: "SAMPLE_MENTION",
      value: "old jazz loop",
      sourceDocumentId: "src_sample",
      quote: "old jazz loop",
      confidence: 1,
    },
    {
      claimId: "claim_unconfirmed",
      contributorCandidate: "Jules Han",
      claimType: "CONFIRMATION_STATEMENT",
      value: false,
      sourceDocumentId: "src_email",
      quote: "not confirmed the final splits",
      confidence: 1,
    },
  ];

  const claims = inputs.map(({ sourceDocumentId, quote, confidence = 0.99, ...input }) => {
    const fragment = locateFragment(fragments, sourceDocumentId, quote);
    return {
      ...input,
      sourceFragmentId: fragment.fragmentId,
      sourceQuote: quote,
      confidence,
      modelVersion: MODEL_VERSION,
      extractionRunId: RUN_ID,
      schemaVersion: "1.0.0" as const,
    };
  });

  return rejectUnsupportedClaims(claims, fragments);
}

function percentageFor(
  claims: ContributionClaim[],
  contributor: string,
  ownershipType: OwnershipType,
): number | null {
  const claim = claims.find(
    (item) =>
      item.contributorCandidate === contributor &&
      item.claimType === "PERCENTAGE" &&
      typeof item.value === "object" &&
      item.value.ownershipType === ownershipType,
  );
  return claim && typeof claim.value === "object" ? claim.value.basisPoints : null;
}

function claimsFor(claims: ContributionClaim[], contributor: string) {
  return claims.filter((claim) => claim.contributorCandidate === contributor);
}

export function buildContributorLedger(claims: ContributionClaim[]): Contributor[] {
  const definitions = [
    {
      contributorId: "contrib_nova",
      displayName: "Nova Rhee",
      aliases: ["Nova"],
      roles: ["main artist", "writer"],
      creditWording: "Written and performed by Nova Rhee",
    },
    {
      contributorId: "contrib_jules",
      displayName: "Jules Han",
      aliases: ["J. Han"],
      roles: ["producer", "writer"],
      creditWording: "Produced by Jules Han",
    },
    {
      contributorId: "contrib_sora",
      displayName: "Sora Kim",
      aliases: [],
      roles: ["writer"],
      creditWording: "Written by Sora Kim",
    },
    {
      contributorId: "contrib_lena",
      displayName: "Lena Cho",
      aliases: [],
      roles: ["featured vocalist"],
      creditWording: "Featuring Lena Cho",
    },
    {
      contributorId: "contrib_theo",
      displayName: "Theo Lim",
      aliases: [],
      roles: ["mixing engineer"],
      creditWording: null,
    },
  ] as const;

  return definitions.map((definition) => {
    const sourceClaims = claimsFor(claims, definition.displayName);
    return {
      contributorId: definition.contributorId,
      legalName: null,
      displayName: definition.displayName,
      aliases: [...definition.aliases],
      email: null,
      roles: [...definition.roles],
      compositionSplitBasisPoints: percentageFor(claims, definition.displayName, "COMPOSITION"),
      masterOwnershipBasisPoints: percentageFor(claims, definition.displayName, "MASTER"),
      creditWording: definition.creditWording,
      confirmationStatus: "PENDING" as const,
      evidenceCoverage: sourceClaims.length > 1 ? 1 : 0.5,
      sourceClaimIds: sourceClaims.map((claim) => claim.claimId),
      conflicts: [],
      humanReviewRequired: true,
    };
  });
}

export function parseBasisPoints(input: string): number {
  const normalized = input.trim().replace(/%$/, "");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error("Percentage must be a non-negative number with at most two decimals");
  }
  const basisPoints = Math.round(Number(normalized) * 100);
  if (basisPoints < 0 || basisPoints > 10000) {
    throw new Error("Percentage must be between 0 and 100");
  }
  return basisPoints;
}

export function formatBasisPoints(basisPoints: number | null): string {
  if (basisPoints === null) return "—";
  const percentage = basisPoints / 100;
  return `${Number.isInteger(percentage) ? percentage.toFixed(0) : percentage.toFixed(2)}%`;
}
