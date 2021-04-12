/**
 * Reorder data *in place*.
 * @param array Array to be reordered
 * @param from array of indexes to be moved
 * @param to target index without offset
 */
export const reorder = <T>(array: T[], from: number[], to: number) => {
  const froms = from.flatMap((index, i) => array.splice(index + i, 1));
  array.splice(to, 0, ...froms);
  return array
}