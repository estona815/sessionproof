import { getConfig } from "@/server/config";

export const dynamic = "force-dynamic";

export function GET() {
  const config = getConfig();
  const productReady =
    config.APP_MODE === "production" &&
    config.AI_MODE === "gemini" &&
    config.STORAGE_MODE === "gcp" &&
    Boolean(config.GEMINI_MODEL);
  return Response.json(
    {
      status: productReady ? "ready" : "not_ready",
      gates: {
        productionMode: config.APP_MODE === "production",
        geminiMode: config.AI_MODE === "gemini",
        gcpStorage: config.STORAGE_MODE === "gcp",
        geminiModelConfigured: Boolean(config.GEMINI_MODEL),
      },
    },
    { status: productReady ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
