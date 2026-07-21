import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { runGlassCityDemo } from "@/core/demo";
import {
  confirmationStatusCsv,
  contributorLedgerCsv,
  evidenceBundle,
  releasePackMarkdown,
  releasePackPdf,
} from "@/core/exports";

const result = runGlassCityDemo(new Date("2026-07-22T01:00:00.000Z"));
const outputDirectory = path.resolve("output/demo");
const pdfDirectory = path.resolve("output/pdf");
await mkdir(outputDirectory, { recursive: true });
await mkdir(pdfDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDirectory, "contributor-ledger.csv"), contributorLedgerCsv(result)),
  writeFile(
    path.join(outputDirectory, "contribution-claims.json"),
    JSON.stringify(result.claims, null, 2),
  ),
  writeFile(
    path.join(outputDirectory, "conflict-report.json"),
    JSON.stringify(result.conflicts, null, 2),
  ),
  writeFile(path.join(outputDirectory, "confirmation-status.csv"), confirmationStatusCsv(result)),
  writeFile(
    path.join(outputDirectory, "evidence-bundle.json"),
    JSON.stringify(evidenceBundle(result), null, 2),
  ),
  writeFile(path.join(outputDirectory, "release-credit-pack.md"), releasePackMarkdown(result)),
  writeFile(
    path.join(pdfDirectory, "release-credit-pack.pdf"),
    Buffer.from(await releasePackPdf(result)),
  ),
]);
console.log(`Exported fixture artifacts to ${outputDirectory} and ${pdfDirectory}`);
