import type { CSSProperties } from 'vue'

export function getStyle(
  style: CSSProperties,
  filter: (keyof CSSProperties)[] = []
): CSSProperties {
  const needUnit = [
    'fontSize',
    'width',
    'height',
    'top',
    'left',
    'borderWidth',
    'letterSpacing',
    'borderRadius',
  ]
  const result: any = {}
  ;(Object.keys(style) as Array<keyof typeof style>).forEach((key) => {
    if (!filter.includes(key)) {
      result[key] = style[key]

      if (needUnit.includes(key)) {
        // if (result[key]) {
        result[key] += 'px'
        // }
      }
    }
  })

  return result
}
