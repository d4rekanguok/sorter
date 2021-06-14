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
    dragIds: Set<string>
    selectedIds: Set<string>
    pos: Point
    offsetPos: Point
    dropIndex: null | number
  }
  
  interface UnplaceArgs {
    position: Point;
    dimension: Dimension;
    containerDimension: DOMRect;
    scrollPosition: Point;
    length: number;
  }

  interface PlaceArgs {
    index: number;
    dimension: Dimension;
    containerDimension?: DOMRect;
  }

  interface GetContainerMaxDimensionArgs {
    size: number;
    templateDimension: Dimension;
  }

  interface AutoScrollArgs {
    axis: Axis;
    direction: Direction;
    scrollPos: any;
  }

  export interface Strategy {
    place: (args: PlaceArgs) => Point;
    unplace: (args: UnplaceArgs) => number;
    getContainerMaxDimension: (
      args: GetContainerMaxDimensionArgs
    ) => Dimension;
    autoScroll: (args: AutoScrollArgs) => void;
  }
}
