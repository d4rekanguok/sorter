import { createStrategy } from "../createStrategy";

const MARGIN = 2

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
    visibleIdRange = [0, Infinity],
}) => {
    const x = position[0] - containerDimension.left
    const w = dimension[0]

    const min = Math.max(visibleIdRange[0] + MARGIN, 0)
    /* -1 because most of the time the visible element is half way cutoff */
    const max = Math.min(visibleIdRange[1] - MARGIN - 1, length)

    const i = Math.round(x / w)
    return Math.max(min, Math.min(max, i))
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
    const startX = visibleRect.x - wd.x
    const endX = startX + visibleRect.width
    const itemWidth = itemDimension[0]
    const startId = Math.floor(startX / itemWidth) - MARGIN
    const endId = Math.ceil(endX / itemWidth) + MARGIN
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
