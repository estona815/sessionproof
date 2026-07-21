import "server-only";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export async function accessSecretVersion(resourceName: string): Promise<string> {
  if (
    !/^projects\/[a-z0-9-]+\/secrets\/[a-zA-Z0-9_-]+\/versions\/(latest|\d+)$/.test(resourceName)
  ) {
    throw new Error("Secret resource name is invalid");
  }
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({ name: resourceName });
  const value = version.payload?.data?.toString("utf8");
  if (!value) throw new Error("Secret version has no payload");
  return value;
}
