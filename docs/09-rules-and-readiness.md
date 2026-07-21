# Rules and readiness

Rules have stable IDs and version `2026-07-22.1`. The fixture implements composition total, duplicate candidate, missing contributor, conflicting percentage, title, role, unconfirmed contributor, sample review, outdated source, split-type separation, contact, and credit-wording checks. Master-total, artist-name, and evidence-coverage rules remain documented P0 expansion items for live inputs.

Readiness starts at 100 and subtracts 30 per BLOCKER, 7 per ERROR, 2 per WARNING, 0 per INFO. Any open blocker means BLOCKED; otherwise errors mean REVIEW_REQUIRED; warnings mean READY_WITH_WARNINGS. The GLASS CITY fixture has 1 blocker, 6 errors, and 5 warnings: `100 - 30 - 42 - 10 = 18`.

This policy is an internal, versioned workflow heuristic—not a quality certification, rights decision, or legal risk score.
