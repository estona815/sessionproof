import { runGlassCityDemo } from "@/core/demo";
import { noStoreJson } from "@/server/http";

export const dynamic = "force-dynamic";

export function GET() {
  return noStoreJson(runGlassCityDemo());
}
