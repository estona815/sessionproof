import "server-only";

import { z } from "zod";

const ConfigSchema = z.object({
  APP_MODE: z.enum(["demo", "local", "production"]).default("demo"),
  AI_MODE: z.enum(["fixture", "gemini", "disabled"]).default("fixture"),
  STORAGE_MODE: z.enum(["memory", "local", "gcp"]).default("memory"),
  GEMINI_BACKEND: z.enum(["vertex", "developer"]).default("vertex"),
  GEMINI_MODEL: z.string().default(""),
  GOOGLE_CLOUD_PROJECT: z.string().default(""),
  GOOGLE_CLOUD_LOCATION: z.string().default("global"),
  GOOGLE_GENAI_API_KEY: z.string().default(""),
  GEMINI_MAX_RETRIES: z.coerce.number().int().min(0).max(2).default(2),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  GEMINI_MAX_CALLS_PER_RUN: z.coerce.number().int().min(1).max(20).default(8),
  APP_ORIGIN: z.string().url().default("http://localhost:3000"),
  UPLOAD_MAX_BYTES: z.coerce
    .number()
    .int()
    .min(1024)
    .max(25 * 1024 * 1024)
    .default(10 * 1024 * 1024),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

let cached: AppConfig | undefined;

export function getConfig(): AppConfig {
  cached ??= ConfigSchema.parse(process.env);
  return cached;
}

export function assertGeminiConfiguration(config = getConfig()): void {
  if (config.AI_MODE !== "gemini") return;
  if (!config.GEMINI_MODEL) throw new Error("GEMINI_MODEL is required in Gemini mode");
  if (config.GEMINI_BACKEND === "vertex" && !config.GOOGLE_CLOUD_PROJECT) {
    throw new Error("GOOGLE_CLOUD_PROJECT is required for the Vertex AI backend");
  }
  if (config.GEMINI_BACKEND === "developer" && !config.GOOGLE_GENAI_API_KEY) {
    throw new Error("GOOGLE_GENAI_API_KEY is required for the Developer API backend");
  }
}
