import { describe, expect, it } from "vitest";

import { calculateBusinessMetrics } from "@/core/business";
import { compareContributorLedgers } from "@/core/change-comparison";
import {
  buildContributorLedger,
  buildFixtureClaims,
  formatBasisPoints,
  parseBasisPoints,
} from "@/core/claims";
import {
  createConfirmationToken,
  isConfirmationTokenValid,
  revokeConfirmationToken,
} from "@/core/confirmation";
import { runGlassCityDemo } from "@/core/demo";
import { fragmentAllSources, fragmentSource, normalizeText, stableHash } from "@/core/fragments";
import { compositionTotal, duplicateCandidateScore, normalizeContributorName } from "@/core/rules";
import { glassCitySources } from "@/data/demo/glass-city";

describe("source evidence", () => {
  it("generates stable content hashes and line fragments", () => {
    expect(stableHash("same")).toBe(stableHash("same"));
    expect(stableHash("same")).not.toBe(stableHash("different"));
    const fragments = fragmentSource(glassCitySources[0]!);
    expect(fragments).toHaveLength(6);
    expect(fragments[0]?.lineStart).toBe(1);
    expect(fragments.every((fragment) => fragment.boundingBox === null)).toBe(true);
  });

  it("normalizes text without inventing content", () => {
    expect(normalizeText("  Jules\t Han  ")).toBe("Jules Han");
  });
});

describe("claims and deterministic rules", () => {
  it("parses and formats basis points without floats", () => {
    expect(parseBasisPoints("35%")).toBe(3500);
    expect(parseBasisPoints("12.25")).toBe(1225);
    expect(formatBasisPoints(1225)).toBe("12.25%");
    expect(() => parseBasisPoints("110%")).toThrow();
  });

  it("creates the 110% composition total", () => {
    const fragments = fragmentAllSources(glassCitySources);
    const ledger = buildContributorLedger(buildFixtureClaims(fragments));
    expect(compositionTotal(ledger)).toBe(11000);
  });

  it("proposes but does not auto-merge likely aliases", () => {
    expect(normalizeContributorName("Jules Han")).toBe("juleshan");
    expect(duplicateCandidateScore("Jules Han", "J. Han")).toBeGreaterThanOrEqual(0.8);
  });

  it("calculates the expected fixture readiness from open conflicts", () => {
    const result = runGlassCityDemo(new Date("2026-07-22T01:00:00.000Z"));
    expect(result.readiness).toMatchObject({ score: 18, status: "BLOCKED" });
    expect(result.conflicts).toHaveLength(12);
    expect(result.conflicts.map((item) => item.ruleId)).toContain("RULE_SAMPLE_MENTION_REVIEW");
  });
});

describe("confirmation and change comparison", () => {
  it("hashes, expires, and revokes confirmation tokens", () => {
    const now = new Date("2026-07-22T00:00:00.000Z");
    const { token, record } = createConfirmationToken("contrib_lena", now, 1);
    expect(record.tokenHash).not.toContain(token);
    expect(isConfirmationTokenValid(token, record, now)).toBe(true);
    expect(isConfirmationTokenValid(token, record, new Date("2026-07-22T02:00:00.000Z"))).toBe(
      false,
    );
    expect(isConfirmationTokenValid(token, revokeConfirmationToken(record, now), now)).toBe(false);
  });

  it("detects a changed split and invalidated confirmation", () => {
    const before = runGlassCityDemo().contributors;
    const after = before.map((item) =>
      item.contributorId === "contrib_sora"
        ? {
            ...item,
            compositionSplitBasisPoints: 1500,
            confirmationStatus: "NOT_REQUESTED" as const,
          }
        : item,
    );
    const changes = compareContributorLedgers(before, after);
    expect(changes.map((item) => item.field)).toEqual(
      expect.arrayContaining(["compositionSplitBasisPoints", "confirmationStatus"]),
    );
  });
});

describe("business evidence math", () => {
  it("separates arms-length, related-party, refunds, and marketing", () => {
    const revenue = [
      {
        transactionId: "tx1",
        date: "2026-07-20",
        customerId: "c1",
        product: "check",
        amountOriginal: { minorUnits: 1200, currency: "USD" },
        amountUsdMinorUnits: 1200,
        fxDate: null,
        fxSource: null,
        paymentProvider: "manual",
        providerReference: "inv-1",
        armsLength: true,
        relatedParty: false,
        refunded: false,
        refundAt: null,
        evidenceReference: "private/tx1",
      },
      {
        transactionId: "tx2",
        date: "2026-07-21",
        customerId: "c2",
        product: "check",
        amountOriginal: { minorUnits: 1200, currency: "USD" },
        amountUsdMinorUnits: 1200,
        fxDate: null,
        fxSource: null,
        paymentProvider: "manual",
        providerReference: "inv-2",
        armsLength: false,
        relatedParty: true,
        refunded: true,
        refundAt: "2026-07-22T00:00:00.000Z",
        evidenceReference: "private/tx2",
      },
    ];
    const expenses = [
      {
        expenseId: "e1",
        date: "2026-07-20",
        category: "MARKETING" as const,
        amount: { minorUnits: 300, currency: "USD" },
        amountUsdMinorUnits: 300,
        fxDate: null,
        fxSource: null,
        evidenceReference: "private/e1",
      },
    ];
    expect(
      calculateBusinessMetrics(revenue, expenses, new Date("2026-07-22T00:00:00.000Z")),
    ).toMatchObject({
      totalRevenueUsdMinorUnits: 1200,
      armsLengthRevenueUsdMinorUnits: 1200,
      relatedPartyRevenueUsdMinorUnits: 0,
      refundedRevenueUsdMinorUnits: 1200,
      marketingSpendUsdMinorUnits: 300,
      netIncomeUsdMinorUnits: 900,
    });
  });
});
