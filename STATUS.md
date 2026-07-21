# Product status

Updated: 2026-07-22T02:00:58+09:00

## Implemented

- No-login fictional Guided Demo with a visible fixture/Gemini boundary.
- Seven GLASS CITY sources, line/row fragments, SHA-256 hashes, 25 supported claims, five contributors, and exact quote validation.
- Deterministic 110% split, duplicate alias, missing contributor, percentage, title, role, sample, contact, wording, outdated-source, split-type, and confirmation checks.
- Explainable readiness policy that computes 18/100 and BLOCKED from 12 open conflicts.
- Evidence inspector, clarification questions, confirmation preview, agent/tool trace, JSON/CSV/Markdown/PDF exports.
- Production-shaped Gemini, Firestore, Cloud Storage, Secret Manager, and Cloud Run adapters/configuration.
- Upload validation, private token primitives, security headers/CSP, same-origin mutation guard, and rate limits.
- Per-request CSP nonces with forced dynamic rendering, so strict script policy and React interaction work together.
- Pricing hypothesis, pilot consent intake, trust page, honest operator metrics, financial/customer templates.
- Reproducible desktop/mobile screenshots and production-shaped Cloud Run deployment assets.
- Public MIT-licensed Git repository with project-specific history at https://github.com/estona815/sessionproof.

## Locally verified

- Format, lint, strict TypeScript, and optimized Next.js production build pass.
- 9 unit, 1 integration, and 5 security tests pass.
- 4 Playwright flows pass across desktop Chromium and Pixel 7 emulation.
- Browser QA at 1440×900 and 390×844 verified the agent run, 18/100 blocker state, evidence inspector, and fixture acknowledgement with zero console errors/warnings.
- The sample validator reproduces 7 sources → 26 fragments → 25 supported claims → 12 conflicts → 18/100 BLOCKED.
- CSV, JSON, Markdown, and a visually inspected two-page PDF export were generated successfully.

## Not verified

- Cloud Run deployment or public production URL.
- Live Firestore, Cloud Storage, Secret Manager, or Vertex AI round trips.
- Live Gemini structured call and API usage record.
- Email magic-link authentication and production deletion workflow.
- Actual customers, arms-length revenue, feedback, testimonials, costs, or marketing spend.
- Public demo video and final Devpost submission.

## Gates

```text
PRODUCT_READY=false
BUSINESS_EVIDENCE_READY=false
SUBMISSION_READY=false
```

These values must not change without live, reviewable evidence.
