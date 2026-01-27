/**
 * Type-safe guard that checks if a value is neither null nor undefined.
 * Narrows the type by removing null and undefined from the type union.
 *
 * @param value - The value to check.
 * @returns True if the value is neither null nor undefined, false otherwise.
 * @example
 * const values = [1, null, 2, undefined, 3];
 * const filtered = values.filter(exist); // Type: number[]
 */
export function exist<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
