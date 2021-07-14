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
    length,
}) => {
    const y = position[1] - containerDimension.top
    const h = dimension[1]

    const start = Math.ceil(y / h)
    const end = Math.min(
        length,
        Math.floor((y + containerDimension.height) / h)
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
const autoScroll = ({ axis, direction, scrollPos, depth }) => {
    if (axis === 'y' && direction !== 0) {
        scrollPos.start({ direction, axis, depth, delta: 6 })
    } else {
        scrollPos.stop()
    }
}

/** @type {Drag.Strategy['checkVisibility']} */
const checkVisibility = ({ index, itemDimension, wd }) => {
    const itemHeight = itemDimension[1]
    const top = index * itemHeight
    const bottom = (index + 1) * itemHeight
    const margin = itemHeight * 2

    const min = margin
    const max = wd.height + margin

    return (bottom >= min && bottom <= max) || (top <= max && top >= min)
}

export default createStrategy({
    name: 'vertical',
    place,
    unplace,
    getContainerMaxDimension,
    autoScroll,
    checkVisibility,
})
