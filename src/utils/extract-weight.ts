import { exist } from './exist';

export function extractWeight(
  str: string | null | undefined,
  appreciate: number = 1,
): number | null {
  if (!exist(str)) return null;

  str = str.trim().toLowerCase();

  // Handle formats like "12x62g"
  const multiMatch = str.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(kg|g)$/i);
  if (multiMatch) {
    const quantity = parseFloat(multiMatch[1]);
    const weightPerUnit = parseFloat(multiMatch[2]);
    const unit = multiMatch[3].toLowerCase();
    const totalGrams =
      unit === 'g' ? quantity * weightPerUnit : quantity * weightPerUnit * 1000;
    return +(totalGrams / 1000).toFixed(2) * appreciate;
  }

  // Handle formats like "2.5kg" or "500g"
  const singleMatch = str.match(/^(\d+(?:\.\d+)?)(kg|g)$/i);
  if (singleMatch) {
    const weight = parseFloat(singleMatch[1]);
    const unit = singleMatch[2].toLowerCase();
    return unit === 'kg' ? +weight.toFixed(4) : +(weight / 1000).toFixed(2) * appreciate;
  }

  return null;
}
