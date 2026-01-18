/**
 * Generate a unique ID using a cryptographically secure method when available
 * Falls back to a more robust random ID generator
 *
 * Format: 21 characters of alphanumeric (a-zA-Z0-9_-)
 * Collision probability: ~1 billion IDs needed for 1% collision chance
 */

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
const ID_LENGTH = 21;

/**
 * Get cryptographically random bytes
 */
function getRandomBytes(size: number): Uint8Array {
  // Try to use crypto.getRandomValues (available in browsers and React Native)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  // Fallback: use Math.random with timestamp for additional entropy
  // This is less secure but still much better than simple Math.random
  const bytes = new Uint8Array(size);
  const timestamp = Date.now();
  for (let i = 0; i < size; i++) {
    bytes[i] = Math.floor(Math.random() * 256) ^ (timestamp >> (i % 32));
  }
  return bytes;
}

/**
 * Generate a unique ID
 * @returns A 21-character unique identifier
 */
export function generateId(): string {
  const bytes = getRandomBytes(ID_LENGTH);
  let id = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}

/**
 * Generate a short ID (for less critical uses)
 * @param length - Length of the ID (default: 8)
 * @returns A short unique identifier
 */
export function generateShortId(length: number = 8): string {
  const bytes = getRandomBytes(length);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}
