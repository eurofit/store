export const getLetterGroup = (char: string): string => {
  if (!char) return '#'; // Handle empty input

  const upperChar = char.toUpperCase();

  const code = upperChar.charCodeAt(0);

  // Check for uppercase letters A-Z, and group them by ranges
  if (code >= 65 && code <= 67) return 'A–C';
  if (code >= 68 && code <= 70) return 'D–F';
  if (code >= 71 && code <= 73) return 'G–I';
  if (code >= 74 && code <= 76) return 'J–L';
  if (code >= 77 && code <= 79) return 'M–O';
  if (code >= 80 && code <= 82) return 'P–R';
  if (code >= 83 && code <= 85) return 'S–U';
  if (code >= 86 && code <= 88) return 'V–X';
  if (code >= 89 && code <= 90) return 'Y–Z';

  // Check for numbers
  if (/[0-9]/.test(upperChar)) {
    return '0–9';
  }

  return '#'; // fallback group for non-alphanumerics
};
