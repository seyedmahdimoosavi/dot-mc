export function feeToPercent(fee: number): string {
  return `${(fee / 10_000).toFixed(fee % 100 === 0 ? 2 : 3)}%`;
}
export function sqrtPriceToPrice(sqrtPriceX96: bigint, decimals0: number, decimals1: number): number {
  if (sqrtPriceX96 <= 0n) return 0;
  const q96 = 2 ** 96;
  const sqrt = Number(sqrtPriceX96) / q96;
  return sqrt * sqrt * 10 ** (decimals0 - decimals1);
}
