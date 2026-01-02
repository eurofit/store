export function formatWithCommas(num: number): string {
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(num);
}
