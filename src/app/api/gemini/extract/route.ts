import { extractClaimsWithGemini } from "@/adapters/gemini/client";
import { assertTrustedMutationRequest, noStoreJson } from "@/server/http";
import { checkRateLimit, requestRateLimitKey } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rejected = assertTrustedMutationRequest(request);
  if (rejected) return rejected;
  const rate = checkRateLimit(requestRateLimitKey(request, "gemini-extract"), 5, 60_000);
  if (!rate.allowed) return noStoreJson({ error: "Gemini call limit exceeded" }, { status: 429 });
  try {
    const result = await extractClaimsWithGemini(await request.json());
    return noStoreJson(result);
  } catch (error) {
    const code = error instanceof Error && error.message.includes("required") ? 503 : 422;
    return noStoreJson(
      { error: code === 503 ? "Gemini production backend is not configured" : "Extraction failed" },
      { status: code },
    );
  }
}
