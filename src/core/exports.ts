import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { formatBasisPoints } from "@/core/claims";
import type { DemoResult } from "@/core/schemas";

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function contributorLedgerCsv(result: DemoResult): string {
  const header = [
    "contributor_id",
    "display_name",
    "aliases",
    "roles",
    "composition_split",
    "master_ownership",
    "credit_wording",
    "confirmation_status",
    "evidence_coverage",
  ];
  const rows = result.contributors.map((contributor) => [
    contributor.contributorId,
    contributor.displayName,
    contributor.aliases.join(" | "),
    contributor.roles.join(" | "),
    formatBasisPoints(contributor.compositionSplitBasisPoints),
    formatBasisPoints(contributor.masterOwnershipBasisPoints),
    contributor.creditWording,
    contributor.confirmationStatus,
    contributor.evidenceCoverage,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

export function confirmationStatusCsv(result: DemoResult): string {
  return [
    ["contributor_id", "display_name", "status"],
    ...result.contributors.map((item) => [
      item.contributorId,
      item.displayName,
      item.confirmationStatus,
    ]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
}

export function releasePackMarkdown(result: DemoResult): string {
  const contributorRows = result.contributors
    .map(
      (item) =>
        `| ${item.displayName} | ${item.roles.join(", ")} | ${formatBasisPoints(item.compositionSplitBasisPoints)} | ${item.confirmationStatus} |`,
    )
    .join("\n");
  const conflicts = result.conflicts
    .map((item) => `- **${item.severity}** ${item.title} — ${item.remediation}`)
    .join("\n");
  return `# ${result.project.title} — Release Credit Review Pack

Artist: ${result.project.artist}
Workflow status: ${result.readiness.status} (${result.readiness.score}/100)
Mode: Fictional fixture data

## Contributor ledger

| Contributor | Roles | Composition | Confirmation |
| --- | --- | ---: | --- |
${contributorRows}

## Unresolved items

${conflicts}

## Source inventory

${result.sources.map((source) => `- ${source.filename} — SHA-256 ${source.contentHash}`).join("\n")}

## Disclaimer

SESSIONPROOF organizes contribution records and highlights unresolved information. This review pack is not a contract. It does not determine legal ownership, provide legal advice, clear samples, register copyrights, or guarantee royalty payments. Original source materials remain authoritative.
`;
}

export function evidenceBundle(result: DemoResult) {
  return {
    schemaVersion: result.schemaVersion,
    project: result.project,
    sourceInventory: result.sources.map(({ text, ...metadata }) => {
      void text;
      return metadata;
    }),
    fragments: result.fragments,
    claims: result.claims,
    conflicts: result.conflicts,
    readiness: result.readiness,
    agentRun: result.agentRun,
    disclaimer:
      "Fixture evidence only. This bundle is not a contract, legal opinion, rights determination, or clearance record.",
  };
}

function wrapLine(text: string, max = 88): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > max) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function releasePackPdf(result: DemoResult): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [612, 792];
  let page = document.addPage(pageSize);
  let y = 742;

  const newPage = () => {
    page = document.addPage(pageSize);
    y = 742;
  };
  const draw = (
    text: string,
    options?: { bold?: boolean; size?: number; color?: [number, number, number] },
  ) => {
    const size = options?.size ?? 10;
    if (y < 54) newPage();
    page.drawText(text, {
      x: 50,
      y,
      size,
      font: options?.bold ? bold : regular,
      color: rgb(...(options?.color ?? [0.08, 0.1, 0.16])),
    });
    y -= size + 7;
  };
  const paragraph = (text: string) => {
    wrapLine(text).forEach((line) => draw(line));
    y -= 6;
  };

  draw("SESSIONPROOF", { bold: true, size: 12, color: [0.02, 0.27, 0.84] });
  draw(`${result.project.title} — Release Credit Review Pack`, { bold: true, size: 22 });
  draw(
    `${result.project.artist}  |  ${result.readiness.status}  |  ${result.readiness.score}/100`,
    {
      size: 11,
      color: result.readiness.status === "BLOCKED" ? [0.8, 0.1, 0.1] : [0.08, 0.1, 0.16],
    },
  );
  y -= 12;
  draw("Contributor ledger", { bold: true, size: 15 });
  result.contributors.forEach((item) => {
    draw(`${item.displayName} — ${item.roles.join(", ")}`, { bold: true });
    draw(
      `Composition ${formatBasisPoints(item.compositionSplitBasisPoints)}  |  Master ${formatBasisPoints(item.masterOwnershipBasisPoints)}  |  ${item.confirmationStatus}`,
      { size: 9 },
    );
  });
  y -= 8;
  draw("Unresolved items", { bold: true, size: 15 });
  result.conflicts.forEach((item) => {
    draw(`${item.severity}: ${item.title}`, { bold: true, size: 10 });
    paragraph(item.remediation);
  });
  draw("Disclaimer", { bold: true, size: 15 });
  paragraph(
    "SESSIONPROOF organizes contribution records and highlights unresolved information. It does not determine legal ownership, provide legal advice, clear samples, register copyrights, or guarantee royalty payments. This PDF is a workflow review pack, not a contract.",
  );

  const pages = document.getPages();
  pages.forEach((current, index) => {
    current.drawText(`SESSIONPROOF fixture pack  |  Page ${index + 1} of ${pages.length}`, {
      x: 50,
      y: 28,
      size: 8,
      font: regular,
      color: rgb(0.35, 0.38, 0.44),
    });
  });
  document.setTitle(`${result.project.title} Release Credit Review Pack`);
  document.setSubject("Evidence-linked music credit workflow review");
  return document.save();
}
