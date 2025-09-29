/**
 * Converts various image formats to a displayable data URL
 */
export const convertToDataUrl = (imageData: any): string | null => {
  if (!imageData) return null;

  // If it's already a data URL
  if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
    return imageData;
  }

  // If it's a base64 string without prefix
  if (typeof imageData === 'string') {
    // Try to detect if it's base64
    if (/^[A-Za-z0-9+/=]+$/.test(imageData)) {
      return `data:image/jpeg;base64,${imageData}`;
    }
  }

  // If it's a Uint8Array from SQLite BLOB
  if (imageData instanceof Uint8Array) {
    const base64 = uint8ArrayToBase64(imageData);
    return `data:image/jpeg;base64,${base64}`;
  }

  // If it's an object with type 'Buffer' and data array (common in JSON responses)
  if (imageData.type === 'Buffer' && Array.isArray(imageData.data)) {
    const uint8Array = new Uint8Array(imageData.data);
    const base64 = uint8ArrayToBase64(uint8Array);
    return `data:image/jpeg;base64,${base64}`;
  }

  // If it's a plain array of bytes
  if (Array.isArray(imageData)) {
    const uint8Array = new Uint8Array(imageData);
    const base64 = uint8ArrayToBase64(uint8Array);
    return `data:image/jpeg;base64,${base64}`;
  }

  return null;
};

/**
 * Convert Uint8Array to base64 string (browser-compatible)
 */
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Validates if an image can be displayed
 */
export const isValidImage = (dataUrl: string | null): boolean => {
  return dataUrl !== null && dataUrl.startsWith('data:image');
};