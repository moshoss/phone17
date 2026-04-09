import { decryptText, encryptText } from './crypto';
import { getDefaultSecret } from './key';

const secret = getDefaultSecret();
const sourceText = '<h1>Hello from the TS example</h1>';

const encryptedBundle = encryptText(sourceText, secret);
const decryptedText = decryptText(encryptedBundle, secret);

console.log('Generated secret:');
console.log(secret);
console.log('');
console.log('Encrypted bundle:');
console.log(JSON.stringify(encryptedBundle, null, 2));
console.log('\nDecrypted text:');
console.log(decryptedText);
