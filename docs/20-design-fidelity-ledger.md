# Design fidelity ledger

Concepts: `docs/design/landing-concept.png` and `docs/design/workspace-concept.png`.

| Point           | Concept                                                          | Implementation target                                 |
| --------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Palette         | true white, near-black, cobalt action, amber review, red blocker | CSS tokens in `globals.css`                           |
| Container       | open landing bands; thin-rule multi-column tool                  | no bento/default card grid                            |
| Typography      | large tight grotesk headline; compact deliberate UI chrome       | responsive headline and explicit control/table sizes  |
| Product anatomy | sources, ledger, conflicts, evidence inspector, trace            | code-native interactive React components              |
| Copy            | exact headline/subcopy/CTA; GLASS CITY fixture                   | above-fold copy preserved; no fake metrics            |
| Evidence motif  | line numbers, source fragments, connector/selection rails        | fragment IDs, file/line/quote/rule inspector          |
| Responsive      | desktop 1440×900 with mobile continuation                        | 1180/900/680 breakpoints and horizontal workflow rail |

## Final visual comparison

Validated screenshots are regenerated with `pnpm screenshots` and written to
`output/playwright/`.

| Fidelity point         | Result                                                                                                                                                                                      | Deliberate difference                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette and typography | White, near-black, cobalt actions, amber review states, and red blockers match the concepts. The landing keeps the tight, oversized headline and compact workspace chrome.                  | The implementation uses the system font stack so the app has no external font dependency or tracking request.                                       |
| Landing composition    | The exact headline, explanatory copy, three actions, product preview, five-step workflow, and limitation statement are preserved.                                                           | Preview content uses the verified GLASS CITY fixture: 7 sources, 25 claims, 12 conflicts, and no invented time/BPM/key metadata.                    |
| Workspace anatomy      | The implemented view keeps the toolbar, seven-step rail, conflict table, contributor ledger, 18/100 readiness, 110% total, evidence inspector, deterministic trace, questions, and exports. | Lock/export enablement controls from the concept were omitted because the fixture is intentionally BLOCKED and no production approval state exists. |
| Evidence motif         | Selected rows connect to exact file, line, quote, confidence, and rule records. Composition and master shares remain visibly separate.                                                      | The implementation shows all three supporting split fragments instead of a paginated two-item mock.                                                 |
| Responsive behavior    | At 390×844 the nav is reduced, actions stack, preview becomes 2×2, workflow steps become a horizontal rail, readiness remains visible, and the workspace becomes one column.                | Dense tables remain horizontally information-rich, but the page itself has no horizontal overflow.                                                  |

## Browser QA record

- Desktop: 1440×900 landing and post-agent workspace.
- Mobile: 390×844 landing and post-agent workspace.
- Interactive checks: run agent, view 18/100 blocker state, inspect evidence, and record the Lena fixture acknowledgement.
- Console result: 0 errors and 0 warnings in the final in-app browser pass.
- Automated result: desktop and mobile Playwright flows passed.
- Screenshot files: `landing-desktop.png`, `workspace-desktop.png`, `landing-mobile.png`, and `workspace-mobile.png` in `output/playwright/`.
