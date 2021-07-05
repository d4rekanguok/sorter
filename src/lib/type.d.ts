declare namespace Drag {
    type Rect = [number, number, number, number]
    type Point = [number, number]
    type Dimension = [number, number]
    type Axis = 'x' | 'y'
    type Direction = -1 | 0 | 1
    type StateNames = 'dragging' | 'idle'

    interface Store {
        wd: DOMRect
        itemDimension: Dimension
        ready: boolean
        state: StateNames
        dragIds: Set<number>
        selectedIds: Set<number>
        pos: Point
        offsetPos: Point
    }

    interface UnplaceArgs {
        position: Point
        dimension: Dimension
        containerDimension: DOMRect
        scrollPosition: Point
        length: number
    }

    interface PlaceArgs {
        index: number
        dimension: Dimension
        containerDimension?: DOMRect
    }

    interface GetContainerMaxDimensionArgs {
        size: number
        templateDimension: Dimension
    }

    interface AutoScrollArgs {
        axis: Axis
        direction: Direction
        scrollPos: any
    }

    interface CheckVisibilityArgs {
        index: number
        itemDimension: Dimension
        wd: DOMRect
        scrollPos: Point
        margin: number
    }

    export interface Strategy {
        name?: string
        place: (args: PlaceArgs) => Point
        unplace: (args: UnplaceArgs) => number
        getContainerMaxDimension: (
            args: GetContainerMaxDimensionArgs
        ) => Dimension
        autoScroll: (args: AutoScrollArgs) => void
        checkVisibility?: (args: CheckVisibilityArgs) => boolean
        getWheelDistance?: (args: { delta: Point }) => Point
    }
}
