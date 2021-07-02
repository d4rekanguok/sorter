import { removeItemsFromArray } from './removeItems.js'

/**
 * Reorder data *in place*.
 * @template T
 * @param {T[]} array Array to be reordered
 * @param {number[]} from array of indexes to be moved
 * @param {number} to target index without offset
 * @returns {T[]}
 */
export const reorder = (array, from, to) => {
    const orderedItems = removeItemsFromArray(array, from)
    array.splice(to, 0, ...orderedItems)
    return array
}
