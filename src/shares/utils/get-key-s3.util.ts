export const getKeyS3 = (url?: string): string | null =>
  url ? url.split('/').pop() : null;
