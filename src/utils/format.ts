export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateDiscount(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Normalizes image URLs including Google Drive sharing links, Dropbox links, and relative paths.
 * Converts Google Drive links into direct embeddable CDN links (https://lh3.googleusercontent.com/d/FILE_ID).
 */
export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Already a data URL (e.g. from local file upload)
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Google Drive URL Detection & Conversion
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com/file')) {
    // Match /file/d/FILE_ID/
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }

    // Match ?id=FILE_ID or &id=FILE_ID
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
    }

    // Match /open?id=FILE_ID or /uc?id=FILE_ID
    const openMatch = trimmed.match(/\/(?:open|uc|thumbnail)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
    if (openMatch && openMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
    }
  }

  // Dropbox share links (change dl=0 to raw=1)
  if (trimmed.includes('dropbox.com')) {
    if (trimmed.includes('dl=0')) {
      return trimmed.replace('dl=0', 'raw=1');
    }
    if (!trimmed.includes('raw=1') && !trimmed.includes('dl=1')) {
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}raw=1`;
    }
  }

  return trimmed;
}
