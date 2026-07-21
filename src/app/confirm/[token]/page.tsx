import type { Metadata } from "next";

import { ConfirmationForm } from "@/components/confirmation-form";
import { Brand } from "@/components/site-header";

export const metadata: Metadata = { title: "Contributor Confirmation" };

export default async function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const isFixture = token === "demo-lena";
  return (
    <main className="confirmation-page">
      <Brand />
      {isFixture ? (
        <section>
          <span>Fictional workflow preview</span>
          <h1>Review your GLASS CITY credit.</h1>
          <p>
            You are viewing only the item associated with fictional contributor Lena Cho. No other
            contributor contact details or private responses are shown.
          </p>
          <dl>
            <div>
              <dt>Display name</dt>
              <dd>Lena Cho</dd>
            </div>
            <div>
              <dt>Proposed role</dt>
              <dd>Featured vocalist</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>“Featured vocal recorded by Lena Cho.”</dd>
            </div>
            <div>
              <dt>Workflow status</dt>
              <dd>Pending acknowledgement</dd>
            </div>
          </dl>
          <ConfirmationForm />
          <small>
            This is a workflow acknowledgement, not a legal electronic signature or ownership
            decision.
          </small>
        </section>
      ) : (
        <section>
          <h1>This confirmation link is not available.</h1>
          <p>It may be invalid, expired, revoked, or already used.</p>
        </section>
      )}
    </main>
  );
}
