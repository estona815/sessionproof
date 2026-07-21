import { Firestore, FieldValue } from "@google-cloud/firestore";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { getConfig } from "@/server/config";
import { assertTrustedMutationRequest, noStoreJson } from "@/server/http";
import { checkRateLimit, requestRateLimitKey } from "@/server/rate-limit";

const PilotApplicationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  role: z.enum(["artist", "producer", "writer", "engineer", "manager", "label", "other"]),
  projectSummary: z.string().trim().min(20).max(1500),
  processingConsent: z.literal(true),
  disclaimerAccepted: z.literal(true),
  retentionDays: z.union([z.literal(7), z.literal(30), z.literal(90)]),
});

export async function POST(request: Request) {
  const rejected = assertTrustedMutationRequest(request);
  if (rejected) return rejected;
  const rate = checkRateLimit(requestRateLimitKey(request, "pilot-apply"), 5, 60 * 60 * 1000);
  if (!rate.allowed) return noStoreJson({ error: "Application limit exceeded" }, { status: 429 });
  try {
    const input = PilotApplicationSchema.parse(await request.json());
    const config = getConfig();
    const applicationId = randomUUID();
    if (config.STORAGE_MODE === "gcp" && config.GOOGLE_CLOUD_PROJECT) {
      const database = new Firestore({ projectId: config.GOOGLE_CLOUD_PROJECT });
      await database
        .collection("pilotApplications")
        .doc(applicationId)
        .set({
          ...input,
          status: "RECEIVED",
          testimonialConsent: false,
          createdAt: FieldValue.serverTimestamp(),
        });
      return noStoreJson({ applicationId, saved: true, status: "RECEIVED" }, { status: 201 });
    }
    return noStoreJson(
      {
        applicationId,
        saved: false,
        status: "PREVIEW_ONLY",
        message:
          "The form is valid, but this environment is not connected to private GCP storage. No personal data was retained.",
      },
      { status: 202 },
    );
  } catch {
    return noStoreJson({ error: "Application fields are invalid" }, { status: 400 });
  }
}
