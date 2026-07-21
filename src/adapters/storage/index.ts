import "server-only";

import { Storage } from "@google-cloud/storage";

export interface StoredArtifact {
  artifactId: string;
  objectPath: string;
  contentHash: string;
  size: number;
}

export interface ArtifactStorage {
  put(objectPath: string, bytes: Uint8Array, contentType: string): Promise<StoredArtifact>;
  signedReadUrl(objectPath: string, expiresAt: Date): Promise<string>;
  delete(objectPath: string): Promise<void>;
}

export class GcpArtifactStorage implements ArtifactStorage {
  private readonly storage = new Storage();

  constructor(private readonly bucketName: string) {
    if (!bucketName) throw new Error("A private Cloud Storage bucket is required");
  }

  async put(objectPath: string, bytes: Uint8Array, contentType: string) {
    const { createHash, randomUUID } = await import("node:crypto");
    const safeObjectPath = objectPath.replace(/^\/+/, "");
    if (!safeObjectPath || safeObjectPath.includes("..")) throw new Error("Unsafe object path");
    const file = this.storage.bucket(this.bucketName).file(safeObjectPath);
    await file.save(Buffer.from(bytes), {
      resumable: false,
      contentType,
      metadata: { cacheControl: "private, no-store" },
      validation: "crc32c",
    });
    return {
      artifactId: randomUUID(),
      objectPath: safeObjectPath,
      contentHash: createHash("sha256").update(bytes).digest("hex"),
      size: bytes.byteLength,
    };
  }

  async signedReadUrl(objectPath: string, expiresAt: Date) {
    const [url] = await this.storage.bucket(this.bucketName).file(objectPath).getSignedUrl({
      version: "v4",
      action: "read",
      expires: expiresAt,
    });
    return url;
  }

  async delete(objectPath: string) {
    await this.storage.bucket(this.bucketName).file(objectPath).delete({ ignoreNotFound: true });
  }
}
