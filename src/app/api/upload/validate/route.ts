import { validateUpload } from "@/core/security";
import { getConfig } from "@/server/config";
import { assertTrustedMutationRequest, noStoreJson } from "@/server/http";
import { checkRateLimit, requestRateLimitKey } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rejected = assertTrustedMutationRequest(request);
  if (rejected) return rejected;
  const rate = checkRateLimit(requestRateLimitKey(request, "upload-validate"), 20);
  if (!rate.allowed) return noStoreJson({ error: "Too many upload attempts" }, { status: 429 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("A file is required");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const metadata = validateUpload({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      bytes,
      maxBytes: getConfig().UPLOAD_MAX_BYTES,
    });
    return noStoreJson({
      accepted: true,
      retained: false,
      metadata,
      message:
        "Validation passed. This local validation endpoint does not retain the file; production storage requires the private GCP adapter.",
    });
  } catch (error) {
    return noStoreJson(
      { error: error instanceof Error ? error.message : "Upload rejected" },
      { status: 400 },
    );
  }
}
