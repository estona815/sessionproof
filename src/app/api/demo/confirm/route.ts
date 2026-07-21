import { z } from "zod";

import { applyDemoConfirmation, runGlassCityDemo } from "@/core/demo";
import { assertTrustedMutationRequest, noStoreJson } from "@/server/http";
import { checkRateLimit, requestRateLimitKey } from "@/server/rate-limit";

const InputSchema = z.object({
  contributorId: z.enum([
    "contrib_nova",
    "contrib_jules",
    "contrib_sora",
    "contrib_lena",
    "contrib_theo",
  ]),
  action: z.enum(["CONFIRM", "DISPUTE", "PROPOSE_CORRECTION"]),
});

export async function POST(request: Request) {
  const rejected = assertTrustedMutationRequest(request);
  if (rejected) return rejected;
  const rate = checkRateLimit(requestRateLimitKey(request, "demo-confirm"), 20);
  if (!rate.allowed) return noStoreJson({ error: "Too many requests" }, { status: 429 });
  try {
    const input = InputSchema.parse(await request.json());
    const result = applyDemoConfirmation(runGlassCityDemo(), input.contributorId, input.action);
    return noStoreJson({
      result,
      message:
        "Fixture acknowledgement recorded for this response only. The readiness engine was recomputed; unresolved split and sample-review items remain.",
    });
  } catch {
    return noStoreJson({ error: "Invalid confirmation response" }, { status: 400 });
  }
}
