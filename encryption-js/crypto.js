const crypto = require('node:crypto');

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const AUTH_TAG_LENGTH = 16;
const FIXED_IV_BASE64 = 'QUJDREVGR0hJSktM';

function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

function getFixedIv() {
  return Buffer.from(FIXED_IV_BASE64, 'base64');
}

function encryptText(plainText, secret) {
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, deriveKey(secret), getFixedIv());
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([tag, ciphertext]).toString('base64');
}

function decryptText(encryptedText, secret) {
  if (!encryptedText) {
    throw new Error('Unsupported encrypted bundle');
  }

  const payload = Buffer.from(encryptedText, 'base64');
  const tag = payload.subarray(0, AUTH_TAG_LENGTH);
  const ciphertext = payload.subarray(AUTH_TAG_LENGTH);

  if (tag.length !== AUTH_TAG_LENGTH || ciphertext.length === 0) {
    throw new Error('Invalid encrypted payload');
  }

  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    deriveKey(secret),
    getFixedIv()
  );

  decipher.setAuthTag(tag);

  const plainText = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plainText.toString('utf8');
}

module.exports = {
  decryptText,
  encryptText,
  FIXED_IV_BASE64,
};
