/**
 * A simple utility function to pluralize English nouns.
 * This function handles basic pluralization rules.
 * @param word - The singular noun to be pluralized.
 * @returns The pluralized form of the noun.
 * @example
 * pluralize('cat'); // returns 'cats'
 * pluralize('baby'); // returns 'babies'
 * pluralize('bus'); // returns 'buses'
 */
export function pluralize(word: string): string {
  // if the word ends with 'y' and is preceded by a consonant, replace 'y' with 'ies'
  if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
    return word.slice(0, -1) + 'ies';
  }
  // if the word ends with 's', 'sh', 'ch', 'x', or 'z', add 'es'
  if (
    word.endsWith('s') ||
    word.endsWith('sh') ||
    word.endsWith('ch') ||
    word.endsWith('x') ||
    word.endsWith('z')
  ) {
    return word + 'es';
  }

  // default case: just add 's'
  return word + 's';
}

export function pluralizeByCount(word: string, count: number = 1) {
  return count > 1 ? pluralize(word) : word;
}
