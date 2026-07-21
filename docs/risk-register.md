# Risk register

| Risk                                                    | Severity | Current control                                        | Remaining action                                     |
| ------------------------------------------------------- | -------- | ------------------------------------------------------ | ---------------------------------------------------- |
| No real users or arms-length revenue                    | Critical | Honest zero dashboard and false gates                  | Deploy and run consenting paid pilots                |
| No production Gemini/GCP evidence                       | Critical | Adapters and readiness endpoint fail closed            | Configure project, deploy, capture redacted evidence |
| New-project provenance weak because root has no commits | High     | Attestation records current state                      | Create project repository and preserve history now   |
| AI hallucinates credits                                 | High     | Strict schema plus exact source-quote rejection        | Measure real error rates and human review            |
| Private unreleased music data exposure                  | High     | Private storage design, retention, no raw logging      | Complete auth, deletion, access-isolation tests      |
| Confirmation link leakage/replay                        | High     | 256-bit tokens, stored hash, expiry/revocation helpers | Implement and verify production token transaction    |
| Sample mention misread as clearance                     | High     | Explicit unresolved human-review rule and disclaimer   | Pilot legal-language review                          |
| Name/trademark collision                                | Medium   | Preliminary search only                                | Formal counsel/domain/store checks                   |
| Cloud/model costs                                       | Medium   | call caps, retries, timeouts, fixture demo             | Set budgets/alerts and record unit cost              |
| Video/submission overclaim                              | High     | Manifest evidence gates                                | Reconcile every claim with final evidence            |
