# Architecture

The application is one strict-TypeScript Next.js service. Core modules are pure and deterministic; provider adapters are server-only.

```mermaid
flowchart TD
  A["Source documents"] --> B["Line/row fragments + SHA-256"]
  B --> C["Fixture or Gemini extraction adapter"]
  C --> D["Zod schema + exact quote gate"]
  D --> E["Contributor ledger"]
  E --> F["Versioned deterministic rules"]
  F --> G["Readiness policy"]
  F --> H["Clarification questions"]
  H --> I["Private workflow acknowledgement"]
  I --> F
  G --> J["JSON / CSV / Markdown / PDF pack"]
```

Server-only boundaries contain secrets, provider clients, rate limits, storage, database, and business intake. Browser code receives only the minimum rendered result. Fixture data never enters production business totals.
