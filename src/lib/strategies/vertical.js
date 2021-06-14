import { createStrategy } from '../createStrategy'

/** @type {Drag.Strategy['place']} */
const place = ({ index, dimension }) => {
    const h = dimension[1]
    const y = h * index
    return [0, y]
}

/** @type {Drag.Strategy['unplace']} */
const unplace = ({
    position,
    dimension,
    containerDimension,
    scrollPosition,
    length,
}) => {
    const y = position[1] + scrollPosition[1]
    const h = dimension[1]
    const offsetY = scrollPosition[1]

    const start = Math.ceil(offsetY / h)
    const end = Math.min(
        length,
        Math.floor((offsetY + containerDimension.height) / h)
    )

    const i = Math.round(y / h)
    return Math.max(start, Math.min(end, i))
}

/** @type {Drag.Strategy['getContainerMaxDimension']} */
const getContainerMaxDimension = ({ size, templateDimension }) => {
    const [w, h] = templateDimension
    return [w, h * size]
}

/** @type {Drag.Strategy['autoScroll']} */
const autoScroll = ({ axis, direction, scrollPos }) => {
    if (axis === 'y' && direction !== 0) {
        scrollPos.start({ direction, axis, delta: 3 })
    } else {
        scrollPos.stop()
    }
}

/** @type {Drag.Strategy['checkVisibility']} */
const checkVisibility = ({ index, itemDimension, wd, scrollPos, margin }) => {
    const itemHeight = itemDimension[1]
    const scrollPosY = scrollPos[1]
    const top = index * itemHeight
    const bottom = (index + 1) * itemHeight

    const min = scrollPosY - margin
    const max = scrollPosY + wd.height + margin

    return (bottom >= min && bottom <= max) || (top <= max && top >= min)
}

export default createStrategy({
    place,
    unplace,
    getContainerMaxDimension,
    autoScroll,
    checkVisibility,
})