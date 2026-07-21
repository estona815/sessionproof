import type { ClarificationQuestion, Conflict } from "@/core/schemas";

const questionForRule: Record<string, string> = {
  RULE_COMPOSITION_SPLIT_TOTAL:
    "The current composition records are Nova 50%, Jules 35%, and Sora 25%, totaling 110%. What final percentages have all three writers agreed to?",
  RULE_CONTRIBUTOR_DUPLICATE:
    "Does “J. Han” refer to Jules Han, and should those names be linked as one contributor record?",
  RULE_CONTRIBUTOR_MISSING:
    "Should Lena Cho be listed as the featured vocalist, and what display credit does she approve?",
  RULE_PERCENTAGE_CONFLICT:
    "Should Sora Kim's final composition share be 20% or 25%, or is there another agreed value?",
  RULE_TITLE_CONSISTENCY: "Is the final release title “GLASS CITY” or “CITY OF GLASS”?",
  RULE_SAMPLE_MENTION_REVIEW:
    "Who will review the old jazz loop reference, and what review status should be recorded?",
};

export function generateClarificationQuestions(conflicts: Conflict[]): ClarificationQuestion[] {
  return conflicts
    .filter((item) => item.status === "OPEN")
    .map((item, index) => ({
      questionId: `question_${String(index + 1).padStart(2, "0")}`,
      conflictId: item.conflictId,
      targetContributorIds: item.contributorIds,
      question: questionForRule[item.ruleId] ?? `Please review: ${item.title}.`,
      reason: item.description,
      evidenceFragmentIds: item.sourceFragmentIds,
      responseFormat:
        item.ruleId === "RULE_COMPOSITION_SPLIT_TOTAL"
          ? "A percentage for each writer totaling exactly 100%."
          : "Confirm, dispute, or propose a correction with a short note.",
      blocking: item.blocking,
    }));
}
