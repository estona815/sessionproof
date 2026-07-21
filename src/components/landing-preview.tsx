import { AlertTriangle, FileText, Mail, MessageSquareText } from "lucide-react";

const sources = [
  { icon: FileText, name: "credit_draft_v1.csv", meta: "version 1 · outdated" },
  { icon: MessageSquareText, name: "session_chat.txt", meta: "6 fragments" },
  { icon: Mail, name: "producer_email.txt", meta: "4 fragments" },
];

export function LandingPreview() {
  return (
    <div className="landing-preview" aria-label="GLASS CITY product preview">
      <header className="preview-titlebar">
        <div>
          <strong>GLASS CITY</strong>
          <span>NOVA RHEE · Fixture demo</span>
        </div>
        <dl>
          <div>
            <dt>Total split</dt>
            <dd className="warning-text">110%</dd>
          </div>
          <div>
            <dt>Missing credits</dt>
            <dd className="danger-text">1</dd>
          </div>
        </dl>
      </header>
      <div className="preview-grid">
        <section aria-labelledby="preview-sources">
          <h3 id="preview-sources">Sources</h3>
          <ul className="source-lines">
            {sources.map(({ icon: Icon, name, meta }, index) => (
              <li key={name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" size={16} />
                <div>
                  <strong>{name}</strong>
                  <small>{meta}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="preview-ledger">
          <h3 id="preview-ledger">Claims / ledger</h3>
          <table>
            <thead>
              <tr>
                <th>Contributor</th>
                <th>Role</th>
                <th>Split</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nova Rhee</td>
                <td>Writer</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>Jules Han</td>
                <td>Producer</td>
                <td>35%</td>
              </tr>
              <tr>
                <td>Sora Kim</td>
                <td>Writer</td>
                <td>25%</td>
              </tr>
              <tr className="danger-text">
                <td>Lena Cho</td>
                <td>Missing</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section aria-labelledby="preview-conflicts">
          <h3 id="preview-conflicts">Conflicts</h3>
          <div className="preview-issue selected">
            <AlertTriangle aria-hidden="true" size={17} />
            <div>
              <strong>Composition total is 110%</strong>
              <span>3 linked claims</span>
            </div>
          </div>
          <div className="preview-issue">
            <AlertTriangle aria-hidden="true" size={17} />
            <div>
              <strong>Featured vocalist missing</strong>
              <span>2 linked fragments</span>
            </div>
          </div>
        </section>
        <section aria-labelledby="preview-evidence">
          <h3 id="preview-evidence">Evidence (selected)</h3>
          <div className="evidence-snippet">
            <span>01</span> CITY OF GLASS, Nova Rhee, writer, 50%
            <span>02</span> CITY OF GLASS, Jules Han, producer, 35%
            <span>03</span> CITY OF GLASS, Sora Kim, writer, 25%
          </div>
          <p>
            <strong>Rule</strong>
            RULE_COMPOSITION_SPLIT_TOTAL
          </p>
        </section>
      </div>
    </div>
  );
}
