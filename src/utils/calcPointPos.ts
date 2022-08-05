import { CSSProperties } from 'vue'

export type pos = {
  x: number
  y: number
}

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

type direKeys = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l'

function calculateLeftTop(
  style: CSSProperties,
  curPositon: pos,
  startPos: pos
) {
  const distancePos = {
    x: curPositon.x,
    y: curPositon.y,
  }
  console.log(distancePos, 'dis')
  let x = startPos.x + distancePos.x
  let y = startPos.y + distancePos.y
  console.log(x, 'x')
  const newWidth = Number(style.width) - distancePos.x
  const width = newWidth <= 10 ? 10 : newWidth >= 375 ? 375 : newWidth
  const newHeight = Number(style.height) - distancePos.y
  let height = newHeight <= 10 ? 10 : newHeight
  const maxY = startPos.y + Number(style.height)
  if (height === 10) {
    y = maxY - height
  }
  if (y <= 0) {
    // 拉伸到顶部了
    y = 0
    height = Number(style.height) + startPos.y
  }
  const maxX = startPos.x + Number(style.width)
  console.log([maxX, x], 'cal')
  if (width === 10) {
    x = maxX - width
  }
  if (x <= 0) {
    x = 0
  }
  const pointPos = {
    x,
    y,
  } as pos
  return { isMove: true, width, height, x, y, pointPos }
}

function calculateRightTop(
  style: CSSProperties,
  curPositon: pos,
  startPos: pos
) {
  const distancePos = {
    x: Number(style.width) + curPositon.x,
    y: curPositon.y,
  }
  const x = distancePos.x < 10 ? 10 : distancePos.x > 375 ? 375 : distancePos.x
  let y = startPos.y + distancePos.y
  const newWidth = x
  const maxWidth = 375 - startPos.x
  const width = newWidth <= 10 ? 10 : newWidth > maxWidth ? maxWidth : newWidth
  const newHeight = Number(style.height) - distancePos.y
  let height = newHeight <= 10 ? 10 : newHeight
  const maxY = startPos.y + Number(style.height)
  if (height === 10) {
    y = maxY - height
  }
  if (y <= 0) {
    // 拉伸到顶部了
    y = 0
    height = Number(style.height) + startPos.y
  }
  return { isMove: true, width, height, x: startPos.x, y }
}

function calculateRightBottom(
  style: CSSProperties,
  curPositon: pos,
  startPos: pos
) {
  const distancePos = {
    x: Number(style.width) + curPositon.x,
    y: curPositon.y,
  }
  const x = distancePos.x < 10 ? 10 : distancePos.x > 375 ? 375 : distancePos.x
  let y = startPos.y
  const newWidth = x
  const maxWidth = 375 - startPos.x
  const width = newWidth <= 10 ? 10 : newWidth > maxWidth ? maxWidth : newWidth
  const newHeight = Number(style.height) + distancePos.y
  const height = newHeight <= 10 ? 10 : newHeight
  if (y <= 0) {
    // 拉伸到顶部了
    y = 0
  }
  return { isMove: true, width, height, x: startPos.x, y }
}

function calculateLeftBottom(
  style: CSSProperties,
  curPositon: pos,
  startPos: pos
) {
  const distancePos = {
    x: curPositon.x,
    y: curPositon.y,
  }
  console.log(distancePos, 'dis')
  let x = startPos.x + distancePos.x
  let y = startPos.y
  console.log(x, 'x')
  const newWidth = Number(style.width) - distancePos.x
  const width = newWidth <= 10 ? 10 : newWidth >= 375 ? 375 : newWidth
  const newHeight = Number(style.height) + distancePos.y
  const height = newHeight <= 10 ? 10 : newHeight
  if (y <= 0) {
    // 拉伸到顶部了
    y = 0
  }
  const maxX = startPos.x + Number(style.width)
  console.log([maxX, x], 'cal')
  if (width === 10) {
    x = maxX - width
  }
  if (x <= 0) {
    x = 0
  }
  const pointPos = {
    x,
    y,
  } as pos
  return { isMove: true, width, height, x, y, pointPos }
}

/**
 *
 * @param style 组件样式
 * @param curPositon 当前点击向上的圆点坐标
 * @param proportion 组件比例
 * @param pointInfo 圆点样式
 * @returns
 */
function calculateTop(style: CSSProperties, curPositon: pos, startPos: pos) {
  const distance = curPositon.y
  let y = startPos.y + distance
  const newHeight = Number(style.height) - distance
  const width = style.width
  let height = newHeight <= 10 ? 10 : newHeight
  const maxY = startPos.y + Number(style.height)
  if (height === 10) {
    y = maxY - height
  }
  if (y <= 0) {
    // 拉伸到顶部了
    y = 0
    height = Number(style.height) + startPos.y
  }
  const x = startPos.x
  const pointPos = {
    x: startPos.x + Number(width) / 2,
    y,
  } as pos
  return { isMove: true, width, height, x, y, pointPos }
}

function calculateRight(style: CSSProperties, curPositon: pos, startPos: pos) {
  const distance = Number(style.width) + curPositon.x
  const x = distance < 10 ? 10 : distance > 375 ? 375 : distance
  const newWidth = x
  const width = newWidth <= 10 ? 10 : newWidth
  const height = style.height
  const y = startPos.y
  const pointPos = {
    x,
    y: startPos.y + Number(height) / 2,
  } as pos
  return { isMove: false, width, height, x, y, pointPos }
}

function calculateBottom(style: CSSProperties, curPositon: pos, startPos: pos) {
  const distance = curPositon.y
  let y = startPos.y
  const newHeight = Number(style.height) + distance
  const width = style.width
  const height = newHeight <= 10 ? 10 : newHeight
  if (y <= 0) {
    // 拉伸到顶部了
    y = 0
  }
  const x = startPos.x
  const pointPos = {
    x: startPos.x + Number(width) / 2,
    y,
  } as pos
  return { isMove: false, width, height, x, y, pointPos }
}

function calculateLeft(style: CSSProperties, curPositon: pos, startPos: pos) {
  console.log([startPos.x, curPositon.x], 'start')
  const distance = curPositon.x
  console.log(distance, 'dis')
  let x = startPos.x + distance
  console.log(x, 'x')
  const newWidth = Number(style.width) - distance
  const width = newWidth <= 10 ? 10 : newWidth >= 375 ? 375 : newWidth
  const height = style.height
  const y = startPos.y
  const maxX = startPos.x + Number(style.width)
  console.log([maxX, x], 'cal')
  if (width === 10) {
    x = maxX - width
  }
  if (x <= 0) {
    x = 0
  }
  const pointPos = {
    x,
    y: startPos.y + Number(height) / 2,
  } as pos
  return { isMove: true, width, height, x, y, pointPos }
}

export default function calculateComponentPositonAndSize(
  name: direKeys,
  style: CSSProperties,
  curPositon: pos,
  componentPos: pos
) {
  return funcs[name](style, curPositon, componentPos)
}
