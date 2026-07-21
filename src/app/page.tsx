import { ArrowRight, Check, FileSearch, MessageSquareText, PackageCheck } from "lucide-react";
import Link from "next/link";

import { LandingPreview } from "@/components/landing-preview";
import { SiteHeader } from "@/components/site-header";

const steps = [
  {
    number: "01",
    title: "Sources",
    copy: "Collect notes, chats, emails, and credit tables. Keep line-level references.",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "Claims",
    copy: "Extract contributor, role, wording, and split candidates into a strict schema.",
    icon: MessageSquareText,
  },
  {
    number: "03",
    title: "Conflicts",
    copy: "Calculate totals and surface missing credits, aliases, and mismatched values.",
    icon: ArrowRight,
  },
  {
    number: "04",
    title: "Confirmation",
    copy: "Ask only what is unresolved and record private workflow acknowledgements.",
    icon: Check,
  },
  {
    number: "05",
    title: "Credit pack",
    copy: "Export the ledger, unresolved-item report, and evidence references.",
    icon: PackageCheck,
  },
];

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <h1>Confirm the credits before the release.</h1>
          <p>
            SESSIONPROOF turns scattered session notes into an evidence-linked contributor ledger,
            catches unresolved splits and missing credits, and creates a release-ready review pack.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/demo">
              Run Guided Demo
            </Link>
            <Link className="button secondary" href="/start">
              Start a Release Check
            </Link>
            <Link className="text-link" href="/api/demo/export/markdown">
              View Sample Pack <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <LandingPreview />
      </section>
      <section className="workflow" id="how-it-works">
        <h2>How it works</h2>
        <div className="workflow-steps">
          {steps.map(({ number, title, copy, icon: Icon }) => (
            <article key={number}>
              <div className="workflow-icon">
                <Icon aria-hidden="true" size={21} />
              </div>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <p className="legal-strip">
          SESSIONPROOF is an operations tool. It does not provide legal advice, determine ownership,
          clear samples, register copyrights, or guarantee royalty payments.
        </p>
      </section>
    </main>
  );
}
