import { decryptText, encryptText } from './crypto';
import { getDefaultSecret } from './key';

const secret = getDefaultSecret();
const sourceText = '<h1>Hello from the TS example</h1>';

const encryptedText = encryptText(sourceText, secret);
const decryptedText = decryptText(encryptedText, secret);

console.log('Generated secret:');
console.log(secret);
console.log('');
console.log('Encrypted text:');
console.log(encryptedText);
console.log('\nDecrypted text:');
console.log(decryptedText);
