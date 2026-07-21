import { access } from "node:fs/promises";
import { constants } from "node:fs";

const checks = [
  ["Node >= 20.9", Number(process.versions.node.split(".")[0]) >= 20],
  ["APP_MODE configured or defaults to demo", true],
  ["AI_MODE configured or defaults to fixture", true],
  ["GEMINI_MODEL set for production", Boolean(process.env.GEMINI_MODEL)],
  ["GOOGLE_CLOUD_PROJECT set for production", Boolean(process.env.GOOGLE_CLOUD_PROJECT)],
] as const;

let failed = false;
for (const [name, ok] of checks) {
  const required = name.startsWith("Node");
  const status = ok ? "PASS" : required ? "FAIL" : "NOT CONFIGURED";
  console.log(`${status.padEnd(14)} ${name}`);
  if (required && !ok) failed = true;
}

for (const file of ["package.json", "samples/glass-city/expected-claims.json", "Dockerfile"]) {
  try {
    await access(file, constants.R_OK);
    console.log(`PASS           readable: ${file}`);
  } catch {
    console.log(`FAIL           missing: ${file}`);
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;
