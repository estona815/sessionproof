# Decision log

| Date       | Decision                                                  | Reason                                                                   |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| 2026-07-22 | Create a new `SESSIONPROOF` directory                     | Avoid rebranding or reusing another competition project                  |
| 2026-07-22 | Keep SESSIONPROOF as a working name                       | No direct music-product collision found; legal/domain checks remain open |
| 2026-07-22 | Use Next.js single-service architecture                   | Fastest path to one Cloud Run vertical slice                             |
| 2026-07-22 | Use integer basis points                                  | Avoid floating-point share errors                                        |
| 2026-07-22 | Separate fixture from Gemini modes visibly                | Prevent false production evidence claims                                 |
| 2026-07-22 | Require explicit `GEMINI_MODEL`                           | Avoid silent use of an unverified/deprecated production model ID         |
| 2026-07-22 | Keep LLM extraction subordinate to exact quote validation | Source evidence, not model confidence, controls claim acceptance         |
| 2026-07-22 | Compute readiness with deterministic severity deductions  | Make the result reproducible and explainable                             |
| 2026-07-22 | Use manual billing first                                  | No payment-provider availability was assumed                             |
| 2026-07-22 | Keep business and fixture metrics separate                | Prevent fictional demo use from becoming customer/revenue evidence       |
