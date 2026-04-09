const crypto = require('node:crypto');

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTED_FILE_PREFIX = 'encfile';
const ENCRYPTED_FILE_SEPARATOR = ',';

function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptText(plainText, secret) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, deriveKey(secret), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    ENCRYPTED_FILE_PREFIX,
    iv.toString('base64'),
    tag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(ENCRYPTED_FILE_SEPARATOR);
}

function decryptText(encryptedText, secret) {
  if (!encryptedText) {
    throw new Error('Unsupported encrypted bundle');
  }

  const [prefix, ivBase64, tagBase64, ciphertextBase64] = encryptedText.split(
    ENCRYPTED_FILE_SEPARATOR
  );

  if (!prefix || !ivBase64 || !tagBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted payload');
  }

  if (prefix !== ENCRYPTED_FILE_PREFIX) {
    throw new Error(`Unsupported encrypted prefix: ${prefix}`);
  }

  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    deriveKey(secret),
    Buffer.from(ivBase64, 'base64')
  );

  decipher.setAuthTag(Buffer.from(tagBase64, 'base64'));

  const plainText = Buffer.concat([
    decipher.update(Buffer.from(ciphertextBase64, 'base64')),
    decipher.final(),
  ]);

  return plainText.toString('utf8');
}

module.exports = {
  ENCRYPTED_FILE_PREFIX,
  ENCRYPTED_FILE_SEPARATOR,
  decryptText,
  encryptText,
};
