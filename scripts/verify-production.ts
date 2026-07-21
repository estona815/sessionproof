export {};

const base = process.argv[2];
if (!base) throw new Error("Usage: pnpm tsx scripts/verify-production.ts https://service.example");
const url = new URL(base);
if (url.protocol !== "https:") throw new Error("Production verification requires HTTPS");

for (const endpoint of ["/api/health", "/api/readiness"]) {
  const response = await fetch(new URL(endpoint, url), {
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.text();
  console.log(`${endpoint} ${response.status} ${body.slice(0, 500)}`);
}
