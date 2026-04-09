import crypto from 'node:crypto';

export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

export interface EncryptedBundle {
  iv: string;
  tag: string;
  ciphertext: string;
}

function deriveKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptText(plainText: string, secret: string): EncryptedBundle {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, deriveKey(secret), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}

export function decryptText(bundle: EncryptedBundle, secret: string): string {
  if (!bundle || !bundle.iv || !bundle.tag || !bundle.ciphertext) {
    throw new Error('Unsupported encrypted bundle');
  }

  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    deriveKey(secret),
    Buffer.from(bundle.iv, 'base64')
  );

  decipher.setAuthTag(Buffer.from(bundle.tag, 'base64'));

  const plainText = Buffer.concat([
    decipher.update(Buffer.from(bundle.ciphertext, 'base64')),
    decipher.final(),
  ]);

  return plainText.toString('utf8');
}
