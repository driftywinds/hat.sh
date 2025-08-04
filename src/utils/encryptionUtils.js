import { encoder, decoder } from '../config/Constants';

// Enhanced salt generation with additional entropy
export const generateEnhancedSalt = (sodium) => {
  const baseSalt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
  
  // Add additional entropy sources for enhanced security
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

// Adaptive security parameters based on device capabilities
export const getAdaptiveSecurityParams = (sodium) => {
  // Mobile device detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Mobile devices: Always use INTERACTIVE parameters
  if (isMobile) {
    return {
      opsLimit: sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      memLimit: sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      chunkSize: 16 * 1024 * 1024 // 16MB for mobile
    };
  }
  
  // High-end devices: Use MODERATE parameters
  if ('deviceMemory' in navigator && 'hardwareConcurrency' in navigator) {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (memory >= 8 && cores >= 8) {
      return {
        opsLimit: sodium.crypto_pwhash_OPSLIMIT_MODERATE,
        memLimit: sodium.crypto_pwhash_MEMLIMIT_MODERATE,
        chunkSize: Math.min(memory * 1024 * 1024 * 1024 * 0.25, 128 * 1024 * 1024)
      };
    }
  }
  
  // Default: INTERACTIVE parameters (current behavior)
  return {
    opsLimit: sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    memLimit: sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    chunkSize: 64 * 1024 * 1024 // 64MB default
  };
};

// Optimized key derivation with adaptive parameters
export const optimizedKeyDerivation = async (sodium, password, salt) => {
  const params = getAdaptiveSecurityParams(sodium);
  const enhancedSalt = generateEnhancedSalt(sodium);
  
  const key = sodium.crypto_pwhash(
    sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
    password,
    enhancedSalt,
    params.opsLimit,
    params.memLimit,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
  
  return { key, enhancedSalt, params };
};

// Browser capability detection
export const checkBrowserCapabilities = () => {
  return {
    deviceMemory: 'deviceMemory' in navigator,
    hardwareConcurrency: 'hardwareConcurrency' in navigator,
    webWorkers: typeof Worker !== 'undefined',
    serviceWorkers: 'serviceWorker' in navigator,
    crypto: 'crypto' in window && 'subtle' in window.crypto,
    isSecureContext: window.isSecureContext || false,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
};

// Performance monitoring for encryption operations
export const createPerformanceMonitor = () => {
  const startTime = performance.now();
  
  return {
    start: () => startTime,
    end: () => performance.now() - startTime,
    log: (operation) => {
      const duration = performance.now() - startTime;
      console.log(`${operation} completed in ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

// Enhanced error handling for encryption operations
export const handleEncryptionError = (error, context) => {
  console.error(`Encryption error in ${context}:`, error);
  
  // Provide user-friendly error messages
  const errorMessages = {
    'INVALID_PASSWORD': 'Das Passwort ist zu schwach oder ungültig.',
    'MEMORY_ERROR': 'Nicht genügend Speicher verfügbar. Versuchen Sie eine kleinere Datei.',
    'BROWSER_UNSUPPORTED': 'Ihr Browser unterstützt diese Funktion nicht.',
    'FILE_TOO_LARGE': 'Die Datei ist zu groß für die Verschlüsselung.',
    'UNKNOWN_ERROR': 'Ein unbekannter Fehler ist aufgetreten.'
  };
  
  return errorMessages[error.code] || errorMessages['UNKNOWN_ERROR'];
};

// Validate encryption parameters
export const validateEncryptionParams = (password, file) => {
  const errors = [];
  
  if (!password || password.length < 12) {
    errors.push('Das Passwort muss mindestens 12 Zeichen lang sein.');
  }
  
  if (!file || file.size === 0) {
    errors.push('Bitte wählen Sie eine gültige Datei aus.');
  }
  
  if (file && file.size > 1024 * 1024 * 1024) { // 1GB
    errors.push('Die Datei ist zu groß (Maximum: 1GB).');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 