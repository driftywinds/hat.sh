export const currentVersion = "2.4.0";
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;
export const CHUNK_SIZE = 64 * 1024 * 1024;
export const crypto_secretstream_xchacha20poly1305_ABYTES = 17;
export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
export const SIGNATURES = {
  v1: "Encrypted Using Hat.sh",
  v2_symmetric: "zDKO6XYXioc",
  v2_asymmetric: "hTWKbfoikeg",
};

// Browser-Support-Checks
export const checkBrowserSupport = () => {
  return {
    deviceMemory: 'deviceMemory' in navigator,
    hardwareConcurrency: 'hardwareConcurrency' in navigator,
    webWorkers: typeof Worker !== 'undefined',
    serviceWorkers: 'serviceWorker' in navigator,
    crypto: 'crypto' in window && 'subtle' in window.crypto,
    isSecureContext: window.isSecureContext || false
  };
};

// Mobile Device Detection
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Adaptive Security Parameters
export const getAdaptiveSecurityParams = () => {
  const support = checkBrowserSupport();
  const isMobile = isMobileDevice();
  
  // Mobile devices: Use INTERACTIVE parameters
  if (isMobile) {
    return {
      opsLimit: 'crypto_pwhash_OPSLIMIT_INTERACTIVE',
      memLimit: 'crypto_pwhash_MEMLIMIT_INTERACTIVE',
      chunkSize: 16 * 1024 * 1024 // 16MB for mobile
    };
  }
  
  // High-end devices: Use MODERATE parameters
  if (support.deviceMemory && support.hardwareConcurrency) {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (memory >= 8 && cores >= 8) {
      return {
        opsLimit: 'crypto_pwhash_OPSLIMIT_MODERATE',
        memLimit: 'crypto_pwhash_MEMLIMIT_MODERATE',
        chunkSize: Math.min(memory * 1024 * 1024 * 1024 * 0.25, 128 * 1024 * 1024)
      };
    }
  }
  
  // Default: INTERACTIVE parameters (current behavior)
  return {
    opsLimit: 'crypto_pwhash_OPSLIMIT_INTERACTIVE',
    memLimit: 'crypto_pwhash_MEMLIMIT_INTERACTIVE',
    chunkSize: CHUNK_SIZE
  };
};

// Enhanced Salt Generation
export const generateEnhancedSalt = (sodium) => {
  const baseSalt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
  
  // Add additional entropy sources
  const additionalEntropy = new Uint8Array([
    ...encoder.encode(navigator.userAgent || ''),
    ...encoder.encode(navigator.platform || ''),
    ...new Uint8Array(new ArrayBuffer(8)).map(() => Math.floor(Math.random() * 256))
  ]);
  
  // Combine base salt with additional entropy
  const combined = new Uint8Array([...baseSalt, ...additionalEntropy]);
  
  // Hash the combined data to get final salt
  return sodium.crypto_generichash(
    sodium.crypto_pwhash_SALTBYTES,
    combined
  );
};

// Optimized Key Derivation
export const optimizedKeyDerivation = async (sodium, password, salt) => {
  const params = getAdaptiveSecurityParams();
  const enhancedSalt = generateEnhancedSalt(sodium);
  
  // Use adaptive parameters with fallback
  const opsLimit = sodium[params.opsLimit] || sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
  const memLimit = sodium[params.memLimit] || sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;
  
  const key = sodium.crypto_pwhash(
    sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
    password,
    enhancedSalt,
    opsLimit,
    memLimit,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
  
  return { key, enhancedSalt };
};
