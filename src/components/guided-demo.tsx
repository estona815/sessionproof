"use client";

import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  FileCheck2,
  FileText,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { formatBasisPoints } from "@/core/claims";
import type { Conflict, DemoResult } from "@/core/schemas";

const fixtureFiles = [
  "fictional_session_chat.txt",
  "credit_draft_v1.csv",
  "producer_email.txt",
  "session_notes.md",
  "invoice_summary.csv",
  "release_metadata.json",
  "sample_reference_note.txt",
];

const steps = [
  "Sources",
  "Contributor Ledger",
  "Conflicts",
  "Questions",
  "Confirmation",
  "Export",
  "Agent Trace",
];

const exportLinks = [
  ["ledger", "Contributor ledger", "CSV"],
  ["claims", "Contribution claims", "JSON"],
  ["conflicts", "Conflict report", "JSON"],
  ["confirmations", "Confirmation status", "CSV"],
  ["evidence", "Evidence bundle", "JSON"],
  ["pdf", "Release credit pack", "PDF"],
] as const;

function SeverityIcon({ conflict }: { conflict: Conflict }) {
  if (conflict.severity === "BLOCKER") return <XCircle aria-hidden="true" size={17} />;
  if (conflict.severity === "ERROR") return <AlertCircle aria-hidden="true" size={17} />;
  if (conflict.severity === "WARNING") return <AlertTriangle aria-hidden="true" size={17} />;
  return <CircleHelp aria-hidden="true" size={17} />;
}

export function GuidedDemo() {
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const selectedConflict = useMemo(
    () =>
      result?.conflicts.find((item) => item.conflictId === selectedConflictId) ??
      result?.conflicts[0] ??
      null,
    [result, selectedConflictId],
  );
  const selectedFragments = useMemo(
    () =>
      selectedConflict
        ? (result?.fragments.filter((fragment) =>
            selectedConflict.sourceFragmentIds.includes(fragment.fragmentId),
          ) ?? [])
        : [],
    [result, selectedConflict],
  );

  async function runAgent() {
    setLoading(true);
    setError(null);
    setConfirmationMessage(null);
    try {
      const response = await fetch("/api/demo/run", { cache: "no-store" });
      if (!response.ok) throw new Error("The fixture run could not be completed.");
      const data = (await response.json()) as DemoResult;
      setResult(data);
      setSelectedConflictId(data.conflicts[0]?.conflictId ?? null);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "The run failed.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmLena() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/demo/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sessionproof-request": "1" },
        body: JSON.stringify({ contributorId: "contrib_lena", action: "CONFIRM" }),
      });
      if (!response.ok) throw new Error("The fixture acknowledgement could not be recorded.");
      const data = (await response.json()) as { result: DemoResult; message: string };
      setResult(data.result);
      setConfirmationMessage(data.message);
    } catch (confirmationError) {
      setError(
        confirmationError instanceof Error ? confirmationError.message : "Confirmation failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetDemo() {
    setResult(null);
    setSelectedConflictId(null);
    setConfirmationMessage(null);
    setError(null);
  }

  return (
    <div className="demo-shell">
      <header className="demo-toolbar">
        <div>
          <span>Project</span>
          <strong>GLASS CITY</strong>
        </div>
        <div>
          <span>Artist</span>
          <strong>NOVA RHEE</strong>
        </div>
        <div className="mode-control">
          <span>Mode</span>
          <strong>Fixture demo</strong>
          <small>No Gemini call</small>
        </div>
        <button className="button primary" disabled={loading} onClick={runAgent} type="button">
          {loading ? (
            <LoaderCircle className="spin" aria-hidden="true" size={17} />
          ) : (
            <Play aria-hidden="true" size={17} />
          )}
          {result ? "Run Credit Agent again" : "Run Credit Agent"}
        </button>
        <button className="button secondary" onClick={resetDemo} type="button">
          <RotateCcw aria-hidden="true" size={16} /> Reset demo
        </button>
      </header>

      <div className="demo-layout">
        <aside className="demo-rail" aria-label="Demo workflow">
          <ol>
            {steps.map((step, index) => (
              <li className={result && index === 2 ? "active" : ""} key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
                {result && index < 2 ? <Check aria-label="Complete" size={15} /> : null}
                {result && index === 2 ? <small>BLOCKED</small> : null}
              </li>
            ))}
          </ol>
          <div className="rail-score">
            <span>Readiness score</span>
            <strong>{result ? `${result.readiness.score}/100` : "—/100"}</strong>
            <div className="score-track">
              <span style={{ width: `${result?.readiness.score ?? 0}%` }} />
            </div>
            <span>Composition total</span>
            <strong>{result ? "110%" : "—"}</strong>
            {result ? <small>Over by 10%</small> : null}
          </div>
        </aside>

        {!result ? (
          <main className="demo-idle">
            <div>
              <h1>GLASS CITY source inventory</h1>
              <p>
                Seven fictional files are ready. Run the fixture agent to create fragments,
                evidence-linked claims, conflicts, questions, and exports.
              </p>
            </div>
            <ul>
              {fixtureFiles.map((filename, index) => (
                <li key={filename}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <FileText aria-hidden="true" size={18} />
                  <strong>{filename}</strong>
                  <small>Fictional source</small>
                </li>
              ))}
            </ul>
            <div className="fixture-boundary">
              <ShieldCheck aria-hidden="true" size={22} />
              <p>
                Fixture mode is deterministic and uses no external model. It demonstrates schema and
                workflow behavior, not production Gemini evidence.
              </p>
            </div>
          </main>
        ) : (
          <main className="demo-workspace">
            <section className="workspace-main">
              <div className="workspace-tabs" role="tablist" aria-label="Review views">
                <button type="button" role="tab" aria-selected="false">
                  Contributor ledger
                </button>
                <button className="selected" type="button" role="tab" aria-selected="true">
                  Conflicts
                </button>
              </div>
              <div className="section-heading">
                <h2>Unresolved conflicts ({result.conflicts.length})</h2>
                <span>{result.readiness.status}</span>
              </div>
              <div className="table-wrap">
                <table className="conflict-table">
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Issue</th>
                      <th>Impact</th>
                      <th>Evidence</th>
                      <th aria-label="Open" />
                    </tr>
                  </thead>
                  <tbody>
                    {result.conflicts.map((conflict) => (
                      <tr
                        className={
                          selectedConflict?.conflictId === conflict.conflictId ? "selected" : ""
                        }
                        key={conflict.conflictId}
                        onClick={() => setSelectedConflictId(conflict.conflictId)}
                      >
                        <td data-severity={conflict.severity}>
                          <SeverityIcon conflict={conflict} />
                          <span>{conflict.severity}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedConflictId(conflict.conflictId)}
                          >
                            {conflict.title}
                          </button>
                        </td>
                        <td>{conflict.blocking ? "Blocker" : "Review"}</td>
                        <td>{conflict.sourceFragmentIds.length}</td>
                        <td>
                          <ChevronRight aria-hidden="true" size={16} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="section-heading ledger-heading">
                <h2>Contributor ledger ({result.contributors.length})</h2>
                <small>Composition and master kept separate</small>
              </div>
              <div className="table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Contributor</th>
                      <th>Role</th>
                      <th>Composition</th>
                      <th>Master</th>
                      <th>Confirmation</th>
                      <th>Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.contributors.map((contributor) => (
                      <tr key={contributor.contributorId}>
                        <td>
                          <strong>{contributor.displayName}</strong>
                          {contributor.aliases.length ? (
                            <small>Alias: {contributor.aliases.join(", ")}</small>
                          ) : null}
                        </td>
                        <td>{contributor.roles.join(", ")}</td>
                        <td>{formatBasisPoints(contributor.compositionSplitBasisPoints)}</td>
                        <td>{formatBasisPoints(contributor.masterOwnershipBasisPoints)}</td>
                        <td>{contributor.confirmationStatus}</td>
                        <td>{contributor.sourceClaimIds.length}</td>
                      </tr>
                    ))}
                    <tr className="ledger-total">
                      <td colSpan={2}>Total composition</td>
                      <td>110%</td>
                      <td colSpan={3}>Must total exactly 100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="evidence-inspector" aria-live="polite">
              <header>
                <h2>Evidence inspector</h2>
                <span>{selectedFragments.length} fragment(s)</span>
              </header>
              {selectedConflict ? (
                <>
                  <div className="selected-issue">
                    <span>Selected issue</span>
                    <h3>{selectedConflict.title}</h3>
                    <strong>Why this needs review</strong>
                    <p>{selectedConflict.description}</p>
                  </div>
                  <div className="evidence-stack">
                    {selectedFragments.map((fragment, index) => {
                      const source = result.sources.find(
                        (candidate) => candidate.sourceDocumentId === fragment.sourceDocumentId,
                      );
                      const claim = result.claims.find(
                        (candidate) => candidate.sourceFragmentId === fragment.fragmentId,
                      );
                      return (
                        <article key={fragment.fragmentId}>
                          <span className="evidence-index">{index + 1}</span>
                          <dl>
                            <div>
                              <dt>File</dt>
                              <dd>{source?.filename ?? "Unknown source"}</dd>
                            </div>
                            <div>
                              <dt>Lines</dt>
                              <dd>
                                {fragment.lineStart ?? "unknown"}–{fragment.lineEnd ?? "unknown"}
                              </dd>
                            </div>
                            <div>
                              <dt>Quote</dt>
                              <dd className="source-quote">{fragment.text}</dd>
                            </div>
                            <div>
                              <dt>Confidence</dt>
                              <dd>
                                {claim ? `${Math.round(claim.confidence * 100)}%` : "Rule evidence"}
                              </dd>
                            </div>
                            <div>
                              <dt>Rule</dt>
                              <dd>{selectedConflict.ruleId}</dd>
                            </div>
                          </dl>
                        </article>
                      );
                    })}
                  </div>
                  <div className="remediation">
                    <strong>Human action</strong>
                    <p>{selectedConflict.remediation}</p>
                  </div>
                </>
              ) : null}
            </aside>

            <section className="trace-panel">
              <div className="trace-column">
                <h2>Agent trace</h2>
                <ul>
                  {result.agentRun.toolCalls.map((call) => (
                    <li key={call.toolCallId}>
                      <Check aria-hidden="true" size={14} />
                      <span>{call.tool.replaceAll("_", " ")}</span>
                      <small>{call.status}</small>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="trace-column">
                <h2>Deterministic policy</h2>
                <dl>
                  <div>
                    <dt>Rule version</dt>
                    <dd>{result.agentRun.deterministicRuleVersion}</dd>
                  </div>
                  <div>
                    <dt>Readiness formula</dt>
                    <dd>100 − severity deductions</dd>
                  </div>
                  <div>
                    <dt>Output</dt>
                    <dd>
                      {result.readiness.score}/100 · {result.readiness.status}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="trace-column">
                <h2>Fixture backend</h2>
                <dl>
                  <div>
                    <dt>Model backend</dt>
                    <dd>{result.agentRun.modelBackend}</dd>
                  </div>
                  <div>
                    <dt>Gemini calls</dt>
                    <dd>0</dd>
                  </div>
                  <div>
                    <dt>Token usage</dt>
                    <dd>Not applicable</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="question-export-panel">
              <div>
                <h2>Clarification questions</h2>
                <ol>
                  {result.questions.slice(0, 4).map((question) => (
                    <li key={question.questionId}>{question.question}</li>
                  ))}
                </ol>
                <button
                  className="button secondary"
                  disabled={loading}
                  onClick={confirmLena}
                  type="button"
                >
                  <FileCheck2 aria-hidden="true" size={16} /> Confirm Lena fixture response
                </button>
                {confirmationMessage ? (
                  <p className="inline-message">{confirmationMessage}</p>
                ) : null}
              </div>
              <div>
                <h2>Release credit pack</h2>
                <div className="export-grid">
                  {exportLinks.map(([format, label, type]) => (
                    <a href={`/api/demo/export/${format}`} key={format}>
                      <Download aria-hidden="true" size={16} />
                      <span>{label}</span>
                      <small>{type}</small>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
      {error ? <p className="error-banner">{error}</p> : null}
    </div>
  );
}
