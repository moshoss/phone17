import crypto from 'node:crypto';

export interface SecretPart {
  key: number;
  bytes: number[];
}

export interface GenerateSecretPartsOptions {
  chunkCount?: number;
  randomKeys?: boolean;
}

export function splitSecret(secret: string, chunkCount = 4): string[] {
  const bytes = Buffer.from(secret, 'utf8');
  const normalizedChunkCount = Math.max(1, Math.min(chunkCount, bytes.length || 1));
  const baseSize = Math.floor(bytes.length / normalizedChunkCount);
  const remainder = bytes.length % normalizedChunkCount;
  const chunks: string[] = [];

  let offset = 0;
  for (let index = 0; index < normalizedChunkCount; index += 1) {
    const size = baseSize + (index < remainder ? 1 : 0);
    const chunkBytes = bytes.subarray(offset, offset + size);
    offset += size;

    if (chunkBytes.length > 0) {
      chunks.push(chunkBytes.toString('utf8'));
    }
  }

  return chunks;
}

export function encodeSecretPart(text: string, key: number): SecretPart {
  return {
    key,
    bytes: [...Buffer.from(text, 'utf8')].map(value => value ^ key),
  };
}

export function generateSecretParts(
  secret: string,
  options: GenerateSecretPartsOptions = {}
): SecretPart[] {
  const {
    chunkCount = 4,
    randomKeys = true,
  } = options;

  const parts = splitSecret(secret, chunkCount);

  return parts.map((part, index) => {
    const key = randomKeys
      ? crypto.randomInt(1, 256)
      : ((((index + 1) * 53) + 17) % 255) || 1;

    return encodeSecretPart(part, key);
  });
}

export function formatSecretParts(parts: SecretPart[]): string {
  return JSON.stringify(parts, null, 2);
}
