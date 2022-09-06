/* eslint-disable no-lonely-if */
// import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'
import { abs, divide, multiply } from 'mathjs'

const MAX_WIDTH = 375
const MAX_HEIGHT = 800

const funcs = {
  lt: calculateLeftTop,
  t: calculateTop,
  rt: calculateRightTop,
  r: calculateRight,
  rb: calculateRightBottom,
  b: calculateBottom,
  lb: calculateLeftBottom,
  l: calculateLeft,
}

function calculateLeftTop(style, curPositon, compPos) {
  const x = compPos.x + curPositon.x
  const y = compPos.y + curPositon.y
  const pos = {
    x: x < 0 ? 0 : x,
    y: y < 0 ? 0 : y,
  }
  const newStyles = { ...style }
  newStyles.width = newStyles.width - curPositon.x
  newStyles.height = newStyles.height - curPositon.y
  return { styles: newStyles, pos }
}

function calculateRightTop(style, curPositon, compPos) {
  const x = compPos.x
  const y = compPos.y + curPositon.y
  const pos = {
    x: x < 0 ? 0 : x,
    y: y < 0 ? 0 : y,
  }
  const newStyles = { ...style }
  newStyles.width = newStyles.width + curPositon.x
  newStyles.height = newStyles.height - curPositon.y
  return { styles: newStyles, pos }
}

function calculateRightBottom(style, curPositon, compPos) {
  const newStyles = { ...style }
  const width = style.width + curPositon.x
  newStyles.height = newStyles.height + curPositon.y
  newStyles.width = width > 375 ? 375 : width
  return { styles: newStyles, pos: compPos }
}

function calculateLeftBottom(style, curPositon, compPos) {
  const x = compPos.x + curPositon.x
  const y = compPos.y
  const pos = {
    x: x < 0 ? 0 : x,
    y: y < 0 ? 0 : y,
  }
  const newStyles = { ...style }
  newStyles.width = newStyles.width - curPositon.x
  newStyles.height = newStyles.height + curPositon.y
  return { styles: newStyles, pos }
}

/**
 *
 * @param style 组件样式
 * @param curPositon 当前点击向上的圆点坐标
 * @param proportion 组件比例
 * @param pointInfo 圆点样式
 * @returns
 */
function calculateTop(style, curPositon, compPos) {
  const x = compPos.x
  const y = compPos.y + curPositon.y
  const pos = {
    x: x < 0 ? 0 : x,
    y: y < 0 ? 0 : y,
  }
  let height = style.height
  if (pos.y === 0) {
    height = height + compPos.y
  } else {
    height = height - curPositon.y
  }
  return { styles: { ...style, height }, pos }
}

function calculateRight(style, curPositon, componentPos) {
  const newStyles = { ...style }
  const width = curPositon.x + style.width
  newStyles.width =
    width + componentPos.x > MAX_WIDTH ? MAX_WIDTH - componentPos.x : width
  return { styles: newStyles, pos: componentPos }
}

function calculateBottom(style, curPositon, compPos) {
  const newStyles = { ...style }

  const newHeight = curPositon.y + style.height
  newStyles.height = newHeight
  return { styles: newStyles, pos: compPos }
}

function calculateLeft(style, curPositon, componentPos) {
  const x = componentPos.x + curPositon.x
  const y = componentPos.y
  const pos = {
    x: x < 0 ? 0 : x,
    y: y < 0 ? 0 : y,
  }
  let width = style.width
  if (pos.x === 0) {
    width = width + componentPos.x
  } else {
    width = width - curPositon.x
  }
  return { styles: { ...style, width }, pos }
}

export default function calculateComponentPositonAndSize(
  name: string,
  style,
  curPositon,
  componentPos
) {
  return funcs[name](style, curPositon, componentPos)
}
