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
    length,
}) => {
    const x = position[0] - containerDimension.left
    const w = dimension[0]

    const start = Math.max(Math.ceil(x / w), 0)
    const end = Math.min(
        length,
        Math.floor((x + containerDimension.width) / w)
    )

    const i = Math.round(x / w)
    return Math.max(start, Math.min(end, i))
}

/** @type {Drag.Strategy['getContainerMaxDimension']} */
const getContainerMaxDimension = ({ size, templateDimension }) => {
    const [w, h] = templateDimension
    return [w * size, h]
}

const getAutoScrollZone = ({ pos, visibleRect, isOverlapped }) => {
    const { top, left, right, width, height } = visibleRect
    const zoneWidth = width * 0.2
    const upperZoneRect = new DOMRect(left, top, zoneWidth, height)
    const lowerZoneRect = new DOMRect(
        right - zoneWidth,
        top,
        zoneWidth,
        height
    )

    let direction = 0
    if (isOverlapped(pos, upperZoneRect)) {
        direction = -1
    }

    if (isOverlapped(pos, lowerZoneRect)) {
        direction = 1
    }

    return { axis: 'x', delta: direction * 4 }
}

/** @type {Drag.Strategy['checkVisibility']} */
const checkVisibility = ({ itemDimension, wd, visibleRect }) => {
    const margin = 2
    const startX = visibleRect.x - wd.x
    const endX = startX + visibleRect.width
    const itemWidth = itemDimension[0]
    const startId = Math.floor(startX / itemWidth) - margin
    const endId = Math.ceil(endX / itemWidth) + margin
    return [startId, endId]
}

export default createStrategy({
    name: 'horizontal',
    place,
    unplace,
    getContainerMaxDimension,
    getAutoScrollZone,
    checkVisibility,
})
