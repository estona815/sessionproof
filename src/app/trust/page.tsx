import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Trust, privacy & limitations" };

const sections = [
  {
    title: "What the product does",
    body: "SESSIONPROOF organizes supplied contribution records, links claims to their source fragments, detects deterministic inconsistencies, creates clarification questions, records workflow acknowledgements, and produces a review pack.",
  },
  {
    title: "What it does not do",
    body: "It does not determine legal ownership, provide legal advice, clear samples or interpolations, register copyrights, certify signatures, submit metadata to DSPs, or guarantee royalty payment. Release readiness is an internal workflow status, not an industry certification.",
  },
  {
    title: "AI boundary",
    body: "Gemini may extract supported candidate claims and draft concise questions. Code—not the language model—calculates split totals, scores conflicts, checks token expiry, and decides workflow readiness. Unsupported claims are rejected when their exact quote cannot be found in the referenced fragment.",
  },
  {
    title: "Uploaded files",
    body: "Production uploads are intended for private Cloud Storage with short-lived access, lifecycle deletion, extension and MIME allowlists, server-generated object paths, size limits, and user-selected retention. The public guided demo stores nothing and uses fictional data only.",
  },
  {
    title: "Contributor confirmations",
    body: "Confirmation links use high-entropy tokens whose hashes—not raw tokens—are stored. They expire, can be revoked, expose only that contributor's relevant items, and are described as workflow acknowledgements rather than legal electronic signatures.",
  },
  {
    title: "Logging and evidence",
    body: "Operational logs should contain artifact identifiers, model and rule versions, latency, status, and redacted errors. Original messages, emails, raw files, secrets, and hidden chain-of-thought are not written to application logs.",
  },
];

export default function TrustPage() {
  return (
    <main>
      <SiteHeader />
      <section className="content-hero narrow">
        <h1>Original sources stay authoritative.</h1>
        <p>
          AI extraction can be wrong. Every important claim must remain reviewable, every automatic
          rule must be explainable, and every legal or rights decision stays with people.
        </p>
      </section>
      <section className="trust-list">
        {sections.map((section, index) => (
          <article key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      <section className="disclaimer-block">
        <h2>Product disclaimer</h2>
        <p>
          SESSIONPROOF organizes contribution records and highlights unresolved information. It does
          not determine legal ownership, provide legal advice, clear samples, register copyrights,
          or guarantee royalty payments.
        </p>
      </section>
    </main>
  );
}
