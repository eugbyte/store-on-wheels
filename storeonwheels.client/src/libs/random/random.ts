/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomNum(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
