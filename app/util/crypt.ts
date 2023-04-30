import CryptoJS from "crypto-js";

const KEY: any = import.meta.env.VITE_LOCAL_KEY;

function encrypt(text: string) {
  const secret = CryptoJS.AES.encrypt(text, KEY).toString();
  return secret;
}
function decrypt(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export { encrypt, decrypt };
