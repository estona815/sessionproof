import type { Metadata } from "next";

import { runGlassCityDemo } from "@/core/demo";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Operator Dashboard" };

export default function OperatorPage() {
  const fixture = runGlassCityDemo();
  const realMetrics = [
    ["Real users", 0],
    ["Paid customers", 0],
    ["Arms-length customers", 0],
    ["Revenue (USD)", "$0"],
    ["Expenses (USD)", "$0"],
    ["Marketing spend", "$0"],
    ["Production agent runs", 0],
    ["Production Gemini calls", 0],
    ["Customer feedback", 0],
  ];
  return (
    <main>
      <SiteHeader />
      <section className="operator-header">
        <div>
          <h1>Operator dashboard</h1>
          <p>Business evidence and fixture evidence are intentionally separated.</p>
        </div>
        <strong>SUBMISSION READY: FALSE</strong>
      </section>
      <section className="metrics-section">
        <header>
          <h2>Live business evidence</h2>
          <span>Not connected · all values are actual zeros</span>
        </header>
        <div className="metric-rows">
          {realMetrics.map(([label, value]) => (
            <dl key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </dl>
          ))}
        </div>
      </section>
      <section className="metrics-section fixture-metrics">
        <header>
          <h2>Guided demo fixture</h2>
          <span>Fictional source set · never counted as business evidence</span>
        </header>
        <div className="metric-rows">
          <dl>
            <dt>Source files</dt>
            <dd>{fixture.sources.length}</dd>
          </dl>
          <dl>
            <dt>Fragments</dt>
            <dd>{fixture.fragments.length}</dd>
          </dl>
          <dl>
            <dt>Supported claims</dt>
            <dd>{fixture.claims.length}</dd>
          </dl>
          <dl>
            <dt>Conflicts</dt>
            <dd>{fixture.conflicts.length}</dd>
          </dl>
          <dl>
            <dt>Readiness</dt>
            <dd>{fixture.readiness.score}/100</dd>
          </dl>
          <dl>
            <dt>Fixture Gemini calls</dt>
            <dd>0</dd>
          </dl>
        </div>
      </section>
    </main>
  );
}
