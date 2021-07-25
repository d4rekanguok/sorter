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

    const start = Math.max(Math.ceil(y / h), 0)
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

const getAutoScrollZone = ({ pos, visibleRect, isOverlapped }) => {
    const { top, left, bottom, width, height } = visibleRect
    const zoneHeight = height * 0.2
    const upperZoneRect = new DOMRect(left, top, width, zoneHeight)
    const lowerZoneRect = new DOMRect(
        left,
        bottom - zoneHeight,
        width,
        zoneHeight
    )

    let direction = 0
    if (isOverlapped(pos, upperZoneRect)) {
        direction = -1
    }

    if (isOverlapped(pos, lowerZoneRect)) {
        direction = 1
    }

    return { axis: 'y', delta: direction * 4 }
}

/** @type {Drag.Strategy['checkVisibility']} */
const checkVisibility = ({ itemDimension, wd, visibleRect }) => {
    const margin = 2
    const startY = visibleRect.y - wd.y
    const endY = startY + visibleRect.height
    const itemHeight = itemDimension[1]
    const startId = Math.floor(startY / itemHeight) - margin
    const endId = Math.ceil(endY / itemHeight) + margin
    return [startId, endId]
}

export default createStrategy({
    name: 'vertical',
    place,
    unplace,
    getContainerMaxDimension,
    getAutoScrollZone,
    checkVisibility,
})
