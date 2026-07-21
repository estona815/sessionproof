# Security and privacy

## Implemented secure defaults

- Runtime Zod validation; TypeScript types are not treated as validation.
- Uploaded content is explicitly untrusted data; no HTML/SVG rendering, eval, shell, or source-directed tool calls.
- Extension and MIME allowlists, filename basename/sanitization, size limits, SHA-256, no writes under `public/`.
- Exact-quote claim support gate and separate deterministic decisions.
- Mutation APIs require same-origin/fetch-site checks, a custom request header, and rate limits; public demo reads remain no-store.
- CSP nonce for scripts, `frame-ancestors 'none'`, nosniff, referrer and permissions policies. Development alone adds `unsafe-eval` for Next tooling; production does not.
- Provider and database modules are server-only. No client secrets or `NEXT_PUBLIC_*` secrets.
- 256-bit confirmation tokens, stored hash comparison, expiry, revocation, and replay/used-state primitives.
- Redaction helper for email, phone, and bearer tokens; application errors do not return stacks.
- Lockfile and pnpm project-level allowlist for dependency build scripts.

## Production work still required

Magic-link authentication, project/resource authorization, private confirmation transaction, deletion transaction, content-signature sniffing/malware scanning, edge rate limiting, GCS lifecycle, Firestore security/IAM verification, backup/restore policy, customer data-processing language, and live isolation tests.

No SOC 2, ISO, GDPR-compliance, encryption certification, legal-signature, or sample-clearance claim is made.
