
/**
 * Provably Fair Logic Service
 * Provides cryptographic verification for game outcomes.
 */

export interface FairnessSession {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

// Generate a random string
const generateRandomString = (length: number = 32): string => {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// SHA-256 Hashing using browser's SubtleCrypto
export const sha256 = async (message: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Initialize a new fairness session
export const createFairnessSession = async (clientSeed?: string): Promise<FairnessSession> => {
  const serverSeed = generateRandomString(64);
  const serverSeedHash = await sha256(serverSeed);
  return {
    serverSeed,
    serverSeedHash,
    clientSeed: clientSeed || generateRandomString(16),
    nonce: 0
  };
};

/**
 * Derives a crash multiplier from a hash.
 * Logic: Take the first 13 hex characters of the hash, 
 * convert to decimal, and use a formula for the multiplier.
 */
export const deriveCrashResult = (hash: string): number => {
  // Use a house edge of 3%
  const houseEdge = 0.03;
  
  // Take first 52 bits (13 hex chars)
  const val = parseInt(hash.substring(0, 13), 16);
  const e = Math.pow(2, 52);
  
  // Formula for crash games
  const result = Math.floor((100 * e - val) / (e - val));
  const multiplier = Math.max(1, result / 100);
  
  return parseFloat(multiplier.toFixed(2));
};

/**
 * Derives a dice result (0-100) from a hash.
 */
export const deriveDiceResult = (hash: string): number => {
  const val = parseInt(hash.substring(0, 8), 16);
  return val % 101; // Returns 0-100
};
