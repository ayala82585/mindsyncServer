import crypto from 'crypto';

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY!;
const algorithm = 'aes-256-cbc';
const KEY_SALT = process.env.KEY_SALT !;
const key = crypto.scryptSync(SESSION_SECRET_KEY, KEY_SALT, 32);
const ivLength = 16;


// פונקציות להצפנה של טקסט
export function encrypt(text: string): string {
const iv = crypto.randomBytes(ivLength);
const cipher = crypto.createCipheriv(algorithm, key, iv);
const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return toBase64Url(iv) + '.' + toBase64Url(encrypted);
}

// פונקציות ופענוח של טקסט
export function decrypt(encrypted: string): string {
  const [ivPart, encryptedPart] = encrypted.split('.');
  const iv = fromBase64Url(ivPart);
  const encryptedText = fromBase64Url(encryptedPart);
const decipher = crypto.createDecipheriv(algorithm, key, iv);
const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
return decrypted.toString('utf8');
}

// עוזרת לקידוד base64url
function toBase64Url(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')  // החלפת +
    .replace(/\//g, '_')  // החלפת /
    .replace(/=+$/, '');  // הסרת padding
}

// עוזרת לפענוח base64url חזרה ל-base64 רגיל
function fromBase64Url(base64url: string): Buffer {
  let base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // הוספת padding בחזרה אם חסר
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  return Buffer.from(base64, 'base64');
}
