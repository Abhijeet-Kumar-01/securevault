const MASTER_KEY_STRING = import.meta.env.VITE_ENCRYPTION_KEY;

// Convert string to ArrayBuffer
const getMessageEncoding = (text) => {
  const enc = new TextEncoder();
  return enc.encode(text);
};

// Derive AES key from passphrase
const deriveKey = async () => {
  if (!MASTER_KEY_STRING) {
    throw new Error("VITE_ENCRYPTION_KEY is missing from frontend environment variables.");
  }
  
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    getMessageEncoding(MASTER_KEY_STRING),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: getMessageEncoding("vault-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// Base64 helpers
const bufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const encryptNote = async (plaintext) => {
  const key = await deriveKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedText = getMessageEncoding(plaintext);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encodedText
  );

  // Extract auth tag from the end of the ciphertext
  const cipherBytes = new Uint8Array(ciphertext);
  const encryptedBytes = cipherBytes.slice(0, cipherBytes.length - 16);
  const authTagBytes = cipherBytes.slice(cipherBytes.length - 16);

  return {
    encryptedContent: bufferToBase64(encryptedBytes),
    iv: bufferToBase64(iv),
    authTag: bufferToBase64(authTagBytes)
  };
};

export const decryptNote = async (encryptedContentB64, ivB64, authTagB64) => {
  const key = await deriveKey();
  
  const encryptedBytes = new Uint8Array(base64ToBuffer(encryptedContentB64));
  const authTagBytes = new Uint8Array(base64ToBuffer(authTagB64));
  const iv = new Uint8Array(base64ToBuffer(ivB64));

  // Re-assemble for WebCrypto decryption
  const combinedCipher = new Uint8Array(encryptedBytes.length + authTagBytes.length);
  combinedCipher.set(encryptedBytes, 0);
  combinedCipher.set(authTagBytes, encryptedBytes.length);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    combinedCipher
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
};
