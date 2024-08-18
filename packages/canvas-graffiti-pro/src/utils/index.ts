export function roundToNDecimalPlaces(num: number, n = 2) {
  return parseFloat(num.toFixed(n))
}
