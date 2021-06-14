import { removeItemsFromArray } from './removeItems'

/**
 * Reorder data *in place*.
 * @param {string[]} array Array to be reordered
 * @param {number[]} from array of indexes to be moved
 * @param {number} to target index without offset
 * @returns {string[]}
 */
export const reorder = (array, from, to) => {
    const orderedItems = removeItemsFromArray(array, from)
    array.splice(to, 0, ...orderedItems)
    return array
}
