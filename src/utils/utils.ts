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

export const getMaxDistance = (arr: number[]) => {
  const num = arr.sort((a, b) => a - b)
  return num[num.length - 1] - num[0]
}

export const unique = <T>(
  array: T[],
  compare = (a: number, b: number) => a === b
) => {
  const result = []
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i]
    if (result.findIndex((v) => compare(v, current)) === -1) {
      result.push(current)
    }
  }
  return result
}

export const checkArrayWithPush = (target, key, value) => {
  if (Array.isArray(target[key])) {
    target[key].push(value)
  } else {
    target[key] = [value]
  }
}
