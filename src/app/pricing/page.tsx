import type { Metadata } from "next";
import { Check } from "lucide-react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <main>
      <SiteHeader />
      <section className="content-hero">
        <h1>Pay for one clear release review.</h1>
        <p>
          These are pilot price hypotheses, not an industry standard. The final price and scope are
          confirmed before any manual invoice or payment link is issued.
        </p>
      </section>
      <section className="pricing-layout">
        <article>
          <header>
            <h2>Guided Demo</h2>
            <strong>$0</strong>
            <span>Fictional data · no storage</span>
          </header>
          <ul>
            <li>
              <Check size={16} /> GLASS CITY evidence workflow
            </li>
            <li>
              <Check size={16} /> Deterministic conflict checks
            </li>
            <li>
              <Check size={16} /> Sample export pack
            </li>
          </ul>
          <Link className="button secondary" href="/demo">
            Run Guided Demo
          </Link>
        </article>
        <article className="pricing-primary">
          <header>
            <h2>Release Credit Check</h2>
            <strong>$12</strong>
            <span>Pilot hypothesis · one song · manual invoice</span>
          </header>
          <ul>
            <li>
              <Check size={16} /> Private source intake
            </li>
            <li>
              <Check size={16} /> Evidence-linked contributor ledger
            </li>
            <li>
              <Check size={16} /> Split, role, title, and missing-credit review
            </li>
            <li>
              <Check size={16} /> Confirmation workflow and review pack
            </li>
          </ul>
          <Link className="button primary" href="/start">
            Apply for the pilot
          </Link>
        </article>
        <article>
          <header>
            <h2>Team Pilot</h2>
            <strong>$39</strong>
            <span>Monthly hypothesis · scope confirmed manually</span>
          </header>
          <ul>
            <li>
              <Check size={16} /> Multiple active releases
            </li>
            <li>
              <Check size={16} /> Version comparisons
            </li>
            <li>
              <Check size={16} /> Shared contributor confirmations
            </li>
          </ul>
          <Link className="button secondary" href="/start">
            Discuss a team pilot
          </Link>
        </article>
      </section>
      <p className="page-note">
        Billing provider: manual. Automated checkout is not represented as available. Refund and
        cancellation terms are confirmed with the pilot scope before payment.
      </p>
    </main>
  );
}
