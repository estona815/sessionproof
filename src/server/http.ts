import "server-only";

import { isSameOriginRequest } from "@/core/security";
import { getConfig } from "@/server/config";

export function assertTrustedMutationRequest(request: Request): Response | null {
  if (!isSameOriginRequest(request, getConfig().APP_ORIGIN)) {
    return Response.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return Response.json({ error: "Cross-site request rejected" }, { status: 403 });
  }
  if (request.headers.get("x-sessionproof-request") !== "1") {
    return Response.json({ error: "Required request header is missing" }, { status: 400 });
  }
  return null;
}

export function noStoreJson(body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  return Response.json(body, { ...init, headers });
}
