import { describe, expect, it } from "vitest";

import { applyDemoConfirmation, runGlassCityDemo } from "@/core/demo";
import {
  confirmationStatusCsv,
  contributorLedgerCsv,
  evidenceBundle,
  releasePackMarkdown,
  releasePackPdf,
} from "@/core/exports";

describe("GLASS CITY vertical flow", () => {
  it("runs ingestion through evidence, rules, questions, confirmation, and exports", async () => {
    const result = runGlassCityDemo(new Date("2026-07-22T01:00:00.000Z"));
    expect(result.sources).toHaveLength(7);
    expect(result.fragments.length).toBeGreaterThan(20);
    expect(result.claims).toHaveLength(25);
    expect(
      result.claims.every((claim) =>
        result.fragments.some(
          (fragment) =>
            fragment.fragmentId === claim.sourceFragmentId &&
            fragment.text.includes(claim.sourceQuote),
        ),
      ),
    ).toBe(true);
    expect(result.contributors.map((item) => item.displayName)).toContain("Lena Cho");
    expect(
      result.conflicts.find((item) => item.ruleId === "RULE_COMPOSITION_SPLIT_TOTAL")?.title,
    ).toContain("110%");
    expect(result.questions.length).toBe(result.conflicts.length);
    const confirmed = applyDemoConfirmation(result, "contrib_lena", "CONFIRM");
    expect(
      confirmed.contributors.find((item) => item.contributorId === "contrib_lena")
        ?.confirmationStatus,
    ).toBe("CONFIRMED");
    expect(contributorLedgerCsv(result)).toContain("Nova Rhee");
    expect(confirmationStatusCsv(result)).toContain("PENDING");
    expect(releasePackMarkdown(result)).toContain("not a contract");
    expect(evidenceBundle(result).sourceInventory[0]).not.toHaveProperty("text");
    const pdf = await releasePackPdf(result);
    expect(Buffer.from(pdf).subarray(0, 4).toString()).toBe("%PDF");
    expect(result.agentRun.toolCalls.length).toBeGreaterThanOrEqual(6);
  });
});
