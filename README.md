# SESSIONPROOF

From messy session notes to confirmed credits before release.

SESSIONPROOF is an evidence-linked music credit operations prototype for the 2026 Build with Gemini XPRIZE. It turns fictional chats, notes, emails, spreadsheets, and release metadata into source fragments, structured contribution claims, a contributor ledger, deterministic conflicts, clarification questions, workflow acknowledgements, and a review pack.

## Evidence boundary

- The no-login Guided Demo uses fictional `GLASS CITY` data and a deterministic fixture adapter. It makes zero Gemini calls.
- The production Gemini adapter uses the official `@google/genai` SDK, requires an explicitly configured model, enforces structured output, and rejects claims whose quote is absent from the referenced fragment.
- Google Cloud, customer, revenue, and deployed-production evidence are not verified in this repository yet.
- `BUSINESS_EVIDENCE_READY=false` and `SUBMISSION_READY=false` until independent customers, revenue, production usage, deployment, and submission evidence exist.

## Local run

Prerequisite: Node.js 20.9+ and pnpm 11.

```bash
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`, select **Run Guided Demo**, then **Run Credit Agent**.

## Validation

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:security
pnpm test:e2e
pnpm build
pnpm submission:check
```

Generate fixture exports with `pnpm export:demo`. With a local server on port 4173, run `pnpm screenshots` to capture validated desktop and mobile product views. Outputs are written to ignored `output/demo`, `output/pdf`, and `output/playwright` directories.

## Production modes

| Concern        | Demo                | Production target                         |
| -------------- | ------------------- | ----------------------------------------- |
| AI             | `AI_MODE=fixture`   | `AI_MODE=gemini`                          |
| Gemini backend | none                | Vertex AI or Gemini Developer API adapter |
| Storage        | memory/no retention | private Cloud Storage                     |
| Database       | none                | Firestore                                 |
| Runtime        | local Next.js       | Cloud Run                                 |
| Billing        | none                | manual invoice adapter first              |

Production requires `GEMINI_MODEL` to be set explicitly. The code intentionally has no silent production model fallback.

## Product limitations

SESSIONPROOF organizes contribution records and highlights unresolved information. It does not determine legal ownership, provide legal advice, clear samples, register copyrights, certify legal signatures, submit to DSPs, or guarantee royalty payments. Original source materials remain authoritative.

## Key paths

- `src/core/`: evidence, claims, rules, readiness, confirmations, exports, business math
- `src/adapters/`: Gemini, Firestore, Cloud Storage, Secret Manager
- `src/app/`: landing, demo, pricing, intake, trust, operator, APIs
- `samples/glass-city/`: fictional source set and expected outputs
- `tests/`: unit, integration, security, and browser flows
- `docs/`: contest, architecture, business, evaluation, and submission notes
- `ops/`: empty financial/customer evidence templates; private evidence is gitignored

## License

MIT. Customer source material and private business evidence are not part of the licensed repository.
