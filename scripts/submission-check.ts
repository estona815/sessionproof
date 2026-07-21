import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "README.md",
  "PROMPT.md",
  "PLAN.md",
  "STATUS.md",
  "BUSINESS_STATUS.md",
  "docs/00-contest-requirements.md",
  "docs/01-new-project-attestation.md",
  "docs/05-google-cloud-and-gemini.md",
  "docs/10-security-and-privacy.md",
  "submission/ai-business-narrative.md",
  "submission/video-script.md",
  "submission/final-manifest.json",
  "Dockerfile",
  "cloudbuild.yaml",
];

let failed = false;
for (const file of requiredFiles) {
  try {
    await access(file, constants.R_OK);
    console.log(`PASS ${file}`);
  } catch {
    failed = true;
    console.error(`FAIL missing ${file}`);
  }
}

try {
  const business = await readFile("BUSINESS_STATUS.md", "utf8");
  if (
    !business.includes("BUSINESS_EVIDENCE_READY=false") ||
    !business.includes("SUBMISSION_READY=false")
  ) {
    failed = true;
    console.error(
      "FAIL business evidence gates must remain false without verified customers and revenue",
    );
  }
} catch {
  // Missing file is reported above.
}

process.exitCode = failed ? 1 : 0;
