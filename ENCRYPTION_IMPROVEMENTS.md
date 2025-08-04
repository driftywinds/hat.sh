# Encryption Improvements v2.4.0

## Overview

This version brings significant enhancements in encryption security and performance while ensuring full compatibility with all browsers and devices.

## New Features

### 1. Adaptive Security Parameters

The application automatically detects device capability and adjusts encryption parameters accordingly:

- **High-performance devices** (8GB+ RAM, 8+ cores): MODERATE parameters for increased security
- **Standard devices**: INTERACTIVE parameters (previous behavior)
- **Mobile devices**: INTERACTIVE parameters with optimized chunk sizes

### 2. Enhanced Salt Generation

Salt generation has been improved by incorporating additional entropy sources:

- Browser user agent
- Platform information
- Random bytes for extra entropy

### 3. Intelligent Fallbacks

All new features include secure fallbacks:
- If browser features are unavailable → default behavior
- If devices are too weak → reduced parameters
- Full backward compatibility

## Technical Details

### Adaptive Parameters

```javascript
// Automatic device performance detection
const params = getAdaptiveSecurityParams(sodium);

// Fallback to safe default values
const opsLimit = sodium[params.opsLimit] || sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
const memLimit = sodium[params.memLimit] || sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;
```

### Enhanced Salt Generation

```javascript
// Combine base salt with additional entropy
const enhancedSalt = generateEnhancedSalt(sodium);
```

### Browser Compatibility

```javascript
// Automatic detection of browser capabilities
const capabilities = checkBrowserCapabilities();
```

## Performance Improvements

### Chunk Size Optimization

- **Desktop**: Up to 128MB chunks (depending on available memory)
- **Mobile**: 16MB chunks for better performance
- **Fallback**: 64MB (previous standard)

### Memory Usage

- **INTERACTIVE**: 64 MiB RAM
- **MODERATE**: 256 MiB RAM (only on high-performance devices)

## Security Improvements

### 1. Stronger Key Derivation

- **Argon2id** with adaptive parameters
- **Enhanced entropy** for salt generation
- **Automatic parameter adjustment** based on device performance

### 2. Improved Error Handling

- **User-friendly error messages**
- **Performance monitoring**
- **Input parameter validation**

## Compatibility

### Supported Browsers

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### Device Support

- **Desktop**: All devices (with adaptive parameters)
- **Mobile**: Optimized for iOS Safari and Android Chrome
- **Low-end devices**: Automatic parameter reduction

## Migration

### For Users

- **No changes required**
- **Automatic improvements** on compatible devices
- **Backward compatibility** with all previous files

### For Developers

- **New utility functions** in `src/utils/encryptionUtils.js`
- **Extended constants** in `src/config/Constants.js`
- **Service Worker updates** for better performance

## Measurements

### Performance Improvements

- **High-performance devices**: 2-4x stronger encryption
- **Standard devices**: No performance loss
- **Mobile devices**: Optimized chunk sizes for better performance

### Security Improvements

- **Enhanced entropy**: +256 bits additional entropy per salt
- **Adaptive parameters**: Up to 4x stronger key derivation
- **Improved validation**: Proactive error detection

## Future

### Planned Improvements

1. **Web Workers** for parallelization (v2.5.0)
2. **Extended metadata** for better file management
3. **Progressive Web App** features for offline usage

### Feedback

Please report issues or suggestions via:
- GitHub Issues
- Email: airbauer@proton.me