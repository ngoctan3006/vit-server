export const generatePassword = (length: number = 8) =>
  Math.random().toString(36).slice(-length);
