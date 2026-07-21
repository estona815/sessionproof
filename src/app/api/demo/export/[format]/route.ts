import {
  confirmationStatusCsv,
  contributorLedgerCsv,
  evidenceBundle,
  releasePackMarkdown,
  releasePackPdf,
} from "@/core/exports";
import { runGlassCityDemo } from "@/core/demo";

export const dynamic = "force-dynamic";

const downloads: Record<
  string,
  {
    filename: string;
    contentType: string;
    body: (result: ReturnType<typeof runGlassCityDemo>) => string;
  }
> = {
  ledger: {
    filename: "contributor-ledger.csv",
    contentType: "text/csv; charset=utf-8",
    body: contributorLedgerCsv,
  },
  claims: {
    filename: "contribution-claims.json",
    contentType: "application/json; charset=utf-8",
    body: (result) => JSON.stringify(result.claims, null, 2),
  },
  conflicts: {
    filename: "conflict-report.json",
    contentType: "application/json; charset=utf-8",
    body: (result) => JSON.stringify(result.conflicts, null, 2),
  },
  confirmations: {
    filename: "confirmation-status.csv",
    contentType: "text/csv; charset=utf-8",
    body: confirmationStatusCsv,
  },
  evidence: {
    filename: "evidence-bundle.json",
    contentType: "application/json; charset=utf-8",
    body: (result) => JSON.stringify(evidenceBundle(result), null, 2),
  },
  markdown: {
    filename: "release-credit-pack.md",
    contentType: "text/markdown; charset=utf-8",
    body: releasePackMarkdown,
  },
};

export async function GET(_request: Request, context: { params: Promise<{ format: string }> }) {
  const { format } = await context.params;
  const result = runGlassCityDemo();
  if (format === "pdf") {
    const bytes = await releasePackPdf(result);
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="release-credit-pack.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  const download = downloads[format];
  if (!download) return Response.json({ error: "Unknown export format" }, { status: 404 });
  return new Response(download.body(result), {
    headers: {
      "Content-Type": download.contentType,
      "Content-Disposition": `attachment; filename="${download.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
