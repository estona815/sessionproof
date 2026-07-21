# Implementation plan

Last updated: 2026-07-22

1. **Rules and provenance** — verify official contest rules, repository history, product-name collision, and evidence boundaries. Status: complete for public-source review; official rules must be rechecked before submission.
2. **Local vertical slice** — GLASS CITY sources → fragments → fixture claims → ledger → deterministic conflicts → readiness → evidence → JSON/CSV/Markdown/PDF. Status: implemented.
3. **Product UI** — landing, no-login demo, conflicts, evidence inspector, questions, confirmation preview, export, pricing, trust, pilot intake, operator dashboard. Status: implemented with fixture and honest zero metrics.
4. **Production adapters** — Gemini structured extraction, Firestore, Cloud Storage, Secret Manager, Cloud Run image and health/readiness endpoints. Status: code/config implemented; live credentials and production verification absent.
5. **Business operations** — outreach, consent, customer/revenue/expense evidence, feedback, P&L. Status: templates and plan implemented; real external evidence absent.
6. **Submission** — Devpost narrative, testing instructions, video script, screenshots, repository sharing, final production evidence. Status: drafts and reproducible local screenshots implemented; public URL, video URL, repository URL, and evidence remain external gates.

P1 and P2 work stays deferred until P0 production and business evidence gates are real.
