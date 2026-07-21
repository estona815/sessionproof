import type { SourceDocument } from "@/core/schemas";
import { stableHash } from "@/core/fragments";

const CREATED_AT = "2026-07-22T00:00:00.000Z";

const source = (
  sourceDocumentId: string,
  filename: string,
  mimeType: string,
  version: number,
  isLatest: boolean,
  text: string,
): SourceDocument => ({
  sourceDocumentId,
  filename,
  mimeType,
  version,
  isLatest,
  text,
  contentHash: stableHash(text),
  createdAt: CREATED_AT,
});

export const glassCitySources: SourceDocument[] = [
  source(
    "src_chat",
    "fictional_session_chat.txt",
    "text/plain",
    2,
    true,
    `[2026-07-02 20:14] Nova: GLASS CITY writing: Nova 50%, Jules 35%, Sora 25%.
[2026-07-02 20:16] Sora: I thought my composition share was 20%?
[2026-07-02 20:19] Jules: Lena Cho sang the featured vocal and should be credited.
[2026-07-02 20:22] Jules: You can list me as J. Han on the final credits.
[2026-07-02 20:31] Nova: We used that old jazz loop; sample status still needs review.
[2026-07-02 20:35] Nova: Theo Lim mixed the record.`,
  ),
  source(
    "src_credit_v1",
    "credit_draft_v1.csv",
    "text/csv",
    1,
    false,
    `title,contributor,role,composition_split,master_ownership,credit_wording
CITY OF GLASS,Nova Rhee,writer,50%,50%,Written by Nova Rhee
CITY OF GLASS,Jules Han,producer,35%,30%,Produced by Jules Han
CITY OF GLASS,Sora Kim,writer,25%,20%,Written by Sora Kim
CITY OF GLASS,Theo Lim,mixing engineer,,0%,`,
  ),
  source(
    "src_email",
    "producer_email.txt",
    "text/plain",
    2,
    true,
    `Subject: GLASS CITY final credit notes
Jules Han is both producer and writer on GLASS CITY.
Please use the display credit “Produced by Jules Han”.
I have not confirmed the final splits yet.`,
  ),
  source(
    "src_notes",
    "session_notes.md",
    "text/markdown",
    3,
    true,
    `# GLASS CITY session notes
Artist: NOVA RHEE
Featured vocal recorded by Lena Cho.
Theo Lim completed the mix on 2026-07-08.
Final contributor approval is still outstanding.`,
  ),
  source(
    "src_invoice",
    "invoice_summary.csv",
    "text/csv",
    1,
    true,
    `vendor,service,project,status
Theo Lim,mixing services,GLASS CITY,paid`,
  ),
  source(
    "src_metadata",
    "release_metadata.json",
    "application/json",
    4,
    true,
    `{"title":"GLASS CITY","primaryArtist":"NOVA RHEE","featuredArtists":[],"releaseStatus":"draft"}`,
  ),
  source(
    "src_sample",
    "sample_reference_note.txt",
    "text/plain",
    1,
    true,
    `Possible source: old jazz loop from an unlabelled folder.
Clearance and interpolation status: not reviewed.
Do not infer legal clearance from this note.`,
  ),
];
