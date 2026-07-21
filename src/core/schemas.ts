import { z } from "zod";

export const OwnershipTypeSchema = z.enum([
  "COMPOSITION",
  "MASTER",
  "PERFORMANCE",
  "PRODUCTION",
  "TECHNICAL_CREDIT",
  "VISUAL_CREDIT",
  "UNKNOWN",
]);

export const ConfirmationStatusSchema = z.enum([
  "NOT_REQUESTED",
  "PENDING",
  "CONFIRMED",
  "DISPUTED",
  "CORRECTION_PROPOSED",
  "EXPIRED",
  "REVOKED",
]);

export const ConflictSeveritySchema = z.enum(["INFO", "WARNING", "ERROR", "BLOCKER"]);
export const ReadinessStatusSchema = z.enum([
  "BLOCKED",
  "REVIEW_REQUIRED",
  "READY_WITH_WARNINGS",
  "READY",
]);

export const SourceDocumentSchema = z.object({
  sourceDocumentId: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  version: z.number().int().positive(),
  isLatest: z.boolean(),
  text: z.string(),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  createdAt: z.string().datetime(),
});

export const SourceFragmentSchema = z.object({
  fragmentId: z.string().min(1),
  sourceDocumentId: z.string().min(1),
  page: z.number().int().positive().nullable(),
  row: z.number().int().positive().nullable(),
  lineStart: z.number().int().positive().nullable(),
  lineEnd: z.number().int().positive().nullable(),
  boundingBox: z
    .object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() })
    .nullable(),
  text: z.string().min(1),
  normalizedText: z.string().min(1),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  createdAt: z.string().datetime(),
});

export const ClaimTypeSchema = z.enum([
  "CONTRIBUTOR_NAME",
  "ALIAS",
  "CONTACT",
  "ROLE",
  "CONTRIBUTION_DESCRIPTION",
  "WORK_TITLE",
  "PERCENTAGE",
  "OWNERSHIP_TYPE",
  "CREDIT_WORDING",
  "CONFIRMATION_STATEMENT",
  "SAMPLE_MENTION",
  "ARTIST_NAME",
]);

const ClaimValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.object({
    basisPoints: z.number().int().min(0).max(10000),
    ownershipType: OwnershipTypeSchema,
  }),
]);

export const ContributionClaimSchema = z.object({
  claimId: z.string().min(1),
  contributorCandidate: z.string().nullable(),
  claimType: ClaimTypeSchema,
  value: ClaimValueSchema,
  sourceFragmentId: z.string().min(1),
  sourceQuote: z.string().min(1),
  confidence: z.number().min(0).max(1),
  modelVersion: z.string().min(1),
  extractionRunId: z.string().min(1),
  schemaVersion: z.literal("1.0.0"),
});

export const ContributorSchema = z.object({
  contributorId: z.string().min(1),
  legalName: z.string().nullable(),
  displayName: z.string().min(1),
  aliases: z.array(z.string()),
  email: z.string().email().nullable(),
  roles: z.array(z.string()),
  compositionSplitBasisPoints: z.number().int().min(0).max(10000).nullable(),
  masterOwnershipBasisPoints: z.number().int().min(0).max(10000).nullable(),
  creditWording: z.string().nullable(),
  confirmationStatus: ConfirmationStatusSchema,
  evidenceCoverage: z.number().min(0).max(1),
  sourceClaimIds: z.array(z.string()),
  conflicts: z.array(z.string()),
  humanReviewRequired: z.boolean(),
});

export const ConflictSchema = z.object({
  conflictId: z.string().min(1),
  ruleId: z.string().min(1),
  ruleVersion: z.string().min(1),
  severity: ConflictSeveritySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  blocking: z.boolean(),
  contributorIds: z.array(z.string()),
  claimIds: z.array(z.string()),
  sourceFragmentIds: z.array(z.string()),
  remediation: z.string().min(1),
  status: z.enum(["OPEN", "RESOLVED", "ACCEPTED_RISK"]),
});

export const ReadinessResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  status: ReadinessStatusSchema,
  conflictCounts: z.record(ConflictSeveritySchema, z.number().int().nonnegative()),
  policyVersion: z.string(),
  explanation: z.array(z.string()),
});

export const ClarificationQuestionSchema = z.object({
  questionId: z.string(),
  conflictId: z.string(),
  targetContributorIds: z.array(z.string()),
  question: z.string(),
  reason: z.string(),
  evidenceFragmentIds: z.array(z.string()),
  responseFormat: z.string(),
  blocking: z.boolean(),
});

export const AgentToolCallSchema = z.object({
  toolCallId: z.string(),
  tool: z.string(),
  status: z.enum(["SUCCEEDED", "FAILED", "REJECTED"]),
  inputArtifactIds: z.array(z.string()),
  outputArtifactIds: z.array(z.string()),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
});

export const AgentRunSchema = z.object({
  agentRunId: z.string(),
  projectId: z.string(),
  agentType: z.string(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  status: z.enum(["SUCCEEDED", "FAILED", "CANCELLED"]),
  inputArtifactIds: z.array(z.string()),
  outputArtifactIds: z.array(z.string()),
  modelBackend: z.enum(["fixture", "gemini-developer", "vertex", "disabled"]),
  modelName: z.string().nullable(),
  promptVersion: z.string(),
  schemaVersion: z.string(),
  toolCalls: z.array(AgentToolCallSchema),
  retryCount: z.number().int().nonnegative(),
  latencyMs: z.number().int().nonnegative(),
  tokenUsage: z.object({ input: z.number(), output: z.number() }).nullable(),
  estimatedCost: z.object({ minorUnits: z.number().int(), currency: z.string() }).nullable(),
  deterministicRuleVersion: z.string(),
  errorCode: z.string().nullable(),
  humanApprovalStatus: z.enum(["NOT_REQUIRED", "PENDING", "APPROVED", "REJECTED"]),
});

export const ConfirmationResponseSchema = z.object({
  contributorId: z.string(),
  action: z.enum(["CONFIRM", "DISPUTE", "PROPOSE_CORRECTION"]),
  comment: z.string().max(1000),
  respondedAt: z.string().datetime(),
});

export const MoneySchema = z.object({
  minorUnits: z.number().int(),
  currency: z.string().regex(/^[A-Z]{3}$/),
});

export const RevenueRecordSchema = z.object({
  transactionId: z.string().min(1),
  date: z.string().date(),
  customerId: z.string().min(1),
  product: z.string().min(1),
  amountOriginal: MoneySchema,
  amountUsdMinorUnits: z.number().int().nonnegative(),
  fxDate: z.string().date().nullable(),
  fxSource: z.string().nullable(),
  paymentProvider: z.string().min(1),
  providerReference: z.string().min(1),
  armsLength: z.boolean(),
  relatedParty: z.boolean(),
  refunded: z.boolean(),
  refundAt: z.string().datetime().nullable(),
  evidenceReference: z.string().min(1),
});

export const ExpenseRecordSchema = z.object({
  expenseId: z.string().min(1),
  date: z.string().date(),
  category: z.enum([
    "HOSTING",
    "GEMINI",
    "PAYMENT_FEES",
    "CONTRACTOR",
    "MARKETING",
    "CUSTOMER_ACQUISITION",
    "OTHER",
  ]),
  amount: MoneySchema,
  amountUsdMinorUnits: z.number().int().nonnegative(),
  fxDate: z.string().date().nullable(),
  fxSource: z.string().nullable(),
  evidenceReference: z.string().min(1),
});

export const BusinessMetricSnapshotSchema = z.object({
  capturedAt: z.string().datetime(),
  totalRevenueUsdMinorUnits: z.number().int().nonnegative(),
  armsLengthRevenueUsdMinorUnits: z.number().int().nonnegative(),
  relatedPartyRevenueUsdMinorUnits: z.number().int().nonnegative(),
  refundedRevenueUsdMinorUnits: z.number().int().nonnegative(),
  totalExpenseUsdMinorUnits: z.number().int().nonnegative(),
  marketingSpendUsdMinorUnits: z.number().int().nonnegative(),
  netIncomeUsdMinorUnits: z.number().int(),
});

export const DemoResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  project: z.object({
    projectId: z.string(),
    title: z.string(),
    artist: z.string(),
    mode: z.literal("fixture"),
  }),
  sources: z.array(SourceDocumentSchema),
  fragments: z.array(SourceFragmentSchema),
  claims: z.array(ContributionClaimSchema),
  contributors: z.array(ContributorSchema),
  conflicts: z.array(ConflictSchema),
  readiness: ReadinessResultSchema,
  questions: z.array(ClarificationQuestionSchema),
  agentRun: AgentRunSchema,
});

export type OwnershipType = z.infer<typeof OwnershipTypeSchema>;
export type ConfirmationStatus = z.infer<typeof ConfirmationStatusSchema>;
export type ConflictSeverity = z.infer<typeof ConflictSeveritySchema>;
export type SourceDocument = z.infer<typeof SourceDocumentSchema>;
export type SourceFragment = z.infer<typeof SourceFragmentSchema>;
export type ContributionClaim = z.infer<typeof ContributionClaimSchema>;
export type Contributor = z.infer<typeof ContributorSchema>;
export type Conflict = z.infer<typeof ConflictSchema>;
export type ReadinessResult = z.infer<typeof ReadinessResultSchema>;
export type ClarificationQuestion = z.infer<typeof ClarificationQuestionSchema>;
export type AgentRun = z.infer<typeof AgentRunSchema>;
export type DemoResult = z.infer<typeof DemoResultSchema>;
export type RevenueRecord = z.infer<typeof RevenueRecordSchema>;
export type ExpenseRecord = z.infer<typeof ExpenseRecordSchema>;
export type BusinessMetricSnapshot = z.infer<typeof BusinessMetricSnapshotSchema>;
