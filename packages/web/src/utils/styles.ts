import { CSSProperties } from 'vue'

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
