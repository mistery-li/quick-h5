import { CSSProperties } from 'vue'
import { customStyle } from '../types'

type needUnitKeys =
  | 'width'
  | 'height'
  | 'left'
  | 'top'
  | 'borderWidth'
  | 'rotate'

const needUnitStyleKeys = [
  'width',
  'height',
  'left',
  'top',
  'borderWidth',
  'rotate',
] as const

export const buildStyles = (style: Partial<CSSProperties>) => {
  let newStyle: CSSProperties = {}
  if (!style)
    return (Object.keys(style) as (keyof CSSProperties)[]).forEach((key) => {
      if (needUnitStyleKeys.includes(key)) {
        newStyle[key as needUnitKeys] =
          style[key] + (key === 'rotate' ? 'deg' : 'px')
      } else {
        newStyle[key] = style[key]
      }
    })
  return newStyle
}

export const getNeedsPxStyles = (style: CSSProperties): CSSProperties => {
  const result: any = {}
  const needPxCssStylesArr = ['width', 'height', 'top', 'left']
  ;(Object.keys(style) as Array<keyof typeof style>).forEach((attr) => {
    if (needPxCssStylesArr.includes(attr)) {
      result[attr] = style[attr] + 'px'
    } else {
      result[attr] = style[attr]
    }
  })
  return result
}

export const transformStyls = (_styles: customStyle, unit: string = 'px') => {
  const needToAddUnit = ['width', 'height', 'top', 'left']
  const result: { [Key: string]: CSSProperties[keyof CSSProperties] } = {}
  ;(Object.keys(_styles) as Array<keyof typeof _styles>).forEach((attr) => {
    if (needToAddUnit.includes(attr)) {
      result[attr] = _styles[attr] + unit
    } else {
      result[attr] = _styles[attr]
    }
  })
  return result
}

export const mod360 = (rotate: number) => (rotate + 360) % 360
