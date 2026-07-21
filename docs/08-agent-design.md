# Agent design

| Agent              | State/tools                                                        | Output                                  | Stop/human boundary                                    |
| ------------------ | ------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------ |
| Intake             | document inventory; `list_documents`, `fragment_sources`           | missing-input checklist and fragments   | file/call/fragment caps                                |
| Credit Extraction  | fragments; `submit_structured_claims`, `reject_unsupported_claims` | schema-valid evidence-linked candidates | no unsupported quote, math, merge, or legal conclusion |
| Reconciliation     | claims/ledger; deterministic identity and conflict tools           | duplicate/conflict candidates           | human approves identity merge and final value          |
| Follow-up          | open conflicts; question generator                                 | targeted question pack                  | no sending without approval                            |
| Release Operations | conflicts/confirmations; readiness/export tools                    | next actions, trace, pack               | human approves final export and unresolved risk        |

Each run records model backend/name, prompt/schema/rule versions, tool calls, artifact IDs, retry count, latency, usage/cost when available, error code, and human approval state. Hidden chain-of-thought is neither stored nor displayed.
