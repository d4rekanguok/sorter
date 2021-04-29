export interface UnplaceArgs {
  position: [number, number]
  dimension: [number, number]
  containerDimension: DOMRect
  scrollPosition: [number, number]
  /* data length */
  length: number
}

export interface PlaceArgs {
  dragItemIndex: number
  dimension: [number, number]
  containerDimension?: DOMRect
}