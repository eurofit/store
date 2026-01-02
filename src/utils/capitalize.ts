/**
 * Capitalizes the first letter of the given string and lowercases the rest.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  const lowercased = str.toLowerCase();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}
