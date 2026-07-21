import type { Contributor } from "@/core/schemas";

export interface LedgerChange {
  contributorId: string;
  field: keyof Contributor | "contributor";
  before: unknown;
  after: unknown;
  kind: "ADDED" | "REMOVED" | "CHANGED";
}

const comparedFields: (keyof Contributor)[] = [
  "displayName",
  "roles",
  "compositionSplitBasisPoints",
  "masterOwnershipBasisPoints",
  "creditWording",
  "confirmationStatus",
];

export function compareContributorLedgers(
  previous: Contributor[],
  current: Contributor[],
): LedgerChange[] {
  const changes: LedgerChange[] = [];
  const previousMap = new Map(previous.map((item) => [item.contributorId, item]));
  const currentMap = new Map(current.map((item) => [item.contributorId, item]));
  for (const [contributorId, contributor] of currentMap) {
    const before = previousMap.get(contributorId);
    if (!before) {
      changes.push({
        contributorId,
        field: "contributor",
        before: null,
        after: contributor,
        kind: "ADDED",
      });
      continue;
    }
    for (const field of comparedFields) {
      if (JSON.stringify(before[field]) !== JSON.stringify(contributor[field])) {
        changes.push({
          contributorId,
          field,
          before: before[field],
          after: contributor[field],
          kind: "CHANGED",
        });
      }
    }
  }
  for (const [contributorId, contributor] of previousMap) {
    if (!currentMap.has(contributorId)) {
      changes.push({
        contributorId,
        field: "contributor",
        before: contributor,
        after: null,
        kind: "REMOVED",
      });
    }
  }
  return changes;
}
