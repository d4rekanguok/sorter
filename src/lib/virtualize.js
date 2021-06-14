/**
 * @typedef Args
 * @type {Object}
 * @property {number} index
 * @property {Drag.Dimension} itemDimension
 * @property {DOMRect} wd
 * @property {Point} scrollPos
 * @property {number} margin
 */

/**
 * @param {Args} args
 * @returns {boolean}
 */
export function checkVisibility({
    index,
    itemDimension,
    wd,
    scrollPos,
    margin,
}) {
    const itemHeight = itemDimension[1]
    const scrollPosY = scrollPos[1]
    const top = index * itemHeight
    const bottom = (index + 1) * itemHeight

    const min = scrollPosY - margin
    const max = scrollPosY + wd.height + margin

    return (bottom >= min && bottom <= max) || (top <= max && top >= min)
}
