import type { Metadata } from "next";

import { PilotForm } from "@/components/pilot-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Start a Release Check" };

export default function StartPage() {
  return (
    <main>
      <SiteHeader />
      <section className="form-layout">
        <div>
          <h1>Start with the release, not your whole inbox.</h1>
          <p>
            Tell us what kind of release record needs review. Do not paste messages, contracts, or
            private customer data into this first-contact form.
          </p>
          <dl>
            <div>
              <dt>01</dt>
              <dd>We confirm scope, retention, price, and a private upload route.</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>You upload only the files relevant to one release.</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>You review every conflict before any contributor is contacted.</dd>
            </div>
          </dl>
        </div>
        <PilotForm />
      </section>
    </main>
  );
}
