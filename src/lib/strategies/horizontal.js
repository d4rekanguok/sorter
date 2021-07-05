import { createStrategy } from "../createStrategy";

/** @type {Drag.Strategy['place']} */
const place = ({ index, dimension }) => {
    const w = dimension[0]
    const x = w * index
    return [x, 0]
}

/** @type {Drag.Strategy['unplace']} */
const unplace = ({
    position,
    dimension,
    containerDimension,
    scrollPosition,
    length,
}) => {
    const x = position[0] + scrollPosition[0]
    const w = dimension[0]
    const offsetX = scrollPosition[0]

    const start = Math.ceil(offsetX / w)
    const end = Math.min(
        length,
        Math.floor((offsetX + containerDimension.width) / w)
    )

    const i = Math.round(x / w)
    return Math.max(start, Math.min(end, i))
}

/** @type {Drag.Strategy['getContainerMaxDimension']} */
const getContainerMaxDimension = ({ size, templateDimension }) => {
    const [w, h] = templateDimension
    return [w * size, h]
}

/** @type {Drag.Strategy['autoScroll']} */
const autoScroll = ({ axis, direction, scrollPos, depth }) => {
    if (axis === 'x' && direction !== 0) {
        scrollPos.start({ direction, axis, depth, delta: 6 })
    } else {
        scrollPos.stop()
    }
}

/** @type {Drag.Strategy['checkVisibility']} */
const checkVisibility = ({ index, itemDimension, wd, scrollPos }) => {
    const itemWidth = itemDimension[0]
    const scrollPosX = scrollPos[0]
    const begin = index * itemWidth
    const end = (index + 1) * itemWidth
    const margin = itemDimension[0] * 2

    const min = scrollPosX - margin
    const max = scrollPosX + wd.width + margin

    return (end >= min && end <= max) || (begin <= max && begin >= min)
}

const getWheelDistance = ({ delta }) => {
    const d = delta[0] || delta[1]
    return [d * 0.5, 0]
}

export default createStrategy({
    name: 'horizontal',
    place,
    unplace,
    getContainerMaxDimension,
    autoScroll,
    checkVisibility,
    getWheelDistance,
})
