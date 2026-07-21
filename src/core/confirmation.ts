import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export interface ConfirmationTokenRecord {
  tokenHash: string;
  contributorId: string;
  expiresAt: string;
  revokedAt: string | null;
  usedAt: string | null;
}

export function hashConfirmationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function createConfirmationToken(
  contributorId: string,
  now = new Date(),
  ttlHours = 72,
): { token: string; record: ConfirmationTokenRecord } {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000).toISOString();
  return {
    token,
    record: {
      tokenHash: hashConfirmationToken(token),
      contributorId,
      expiresAt,
      revokedAt: null,
      usedAt: null,
    },
  };
}

export function isConfirmationTokenValid(
  token: string,
  record: ConfirmationTokenRecord,
  now = new Date(),
): boolean {
  if (record.revokedAt || record.usedAt || new Date(record.expiresAt).getTime() <= now.getTime()) {
    return false;
  }
  const incoming = Buffer.from(hashConfirmationToken(token));
  const stored = Buffer.from(record.tokenHash);
  return incoming.length === stored.length && timingSafeEqual(incoming, stored);
}

export function revokeConfirmationToken(
  record: ConfirmationTokenRecord,
  at = new Date(),
): ConfirmationTokenRecord {
  return { ...record, revokedAt: at.toISOString() };
}
