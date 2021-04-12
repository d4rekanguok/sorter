import { removeItemsFromArray } from './removeItems'

/**
 * Reorder data *in place*.
 * @param array Array to be reordered
 * @param from array of indexes to be moved
 * @param to target index without offset
 */
export const reorder = <T>(array: T[], from: number[], to: number) => {
  const orderedItems = removeItemsFromArray(array, from);
  array.splice(to, 0, ...orderedItems);
  return array
}