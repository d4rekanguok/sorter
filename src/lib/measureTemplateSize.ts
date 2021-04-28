export const measureTemplateSize = (container: HTMLElement): [number, number] => {
  const el = (container.childNodes[0]) as HTMLElement
  if (!el) throw new Error('MeasureTemplateSize: No template found')

  const { width, height } = el.getBoundingClientRect()
  const { marginLeft, marginTop, marginRight, marginBottom } = getComputedStyle(el)

  const nextWidth = parseInt(marginLeft, 10) + parseInt(marginRight, 10) + width
  const nextHeight = parseInt(marginTop, 10) + parseInt(marginBottom,10) + height
  
  return [nextWidth, nextHeight]
}