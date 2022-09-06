import { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { getComps, getCurComp } from '../../../store/components'
import { RootState } from '../../../store'
import { ComponentItem } from '../../types'

export const checkArrayWithPush = (target, key, value) => {
  if (Array.isArray(target[key])) {
    target[key].push(value)
  } else {
    target[key] = [value]
  }
}

const getCompLineData = (comp: ComponentItem) => {
  if (!comp) return {}
  const style = comp.style
  const pos = comp.pos
  return {
    w: style.width,
    h: style.height,
    x: pos.x,
    y: pos.y,
    l: pos.x, // 左对齐线
    lr: pos.x + Number(style.width) / 2, // 纵向居中线
    r: pos.x + Number(style.width), // 右对齐线
    t: pos.y, // 顶部对齐线
    tb: pos.y + Number(style.height) / 2, // 横向居中线
    b: pos.y + Number(style.height), // 底部对齐线
  }
}

const MarkLine = ({
  direction,
}: {
  direction: { x: number; y: number } | null
}) => {
  const commonStyle = {
    position: 'absolute',
    backgroundColor: '#ac380a',
  }

  const components = useSelector((state: RootState) => getComps(state))

  const curComp = useSelector((state: RootState) => getCurComp(state))

  const target = components.find((comp) => comp.uuid === curComp?.uuid)

  const compares = components.filter((comp) => comp.uuid !== curComp?.uuid)

  const [state, steState] = useState({
    xLines: [],
    yLines: [],
    indices: [],
  })

  const calcLineValues = (pos, target, compare, linekey) => {
    const { x, y } = pos
    const { h: H, w: W } = getCompLineData(target)
    const { l, r, t, b } = getCompLineData(compare)
    const T = y,
      B = y + H,
      L = x,
      R = x + W

    const direValues = {
      x: [t, b, T, B],
      y: [l, r, L, R],
    }

    const getMaxDistance = (arr) => {
      const num = arr.sort((a, b) => a - b)
      return num[num.length - 1] - num[0]
    }
    const length = getMaxDistance(direValues[linekey])
    const origin = Math.min(...direValues[linekey])
    return { length, origin }
  }

  const calcPosValuesSingle = (pos, direction, target, compare, lineKey) => {
    const { x, y } = pos
    const { w: W, h: H } = getCompLineData(target)
    const { l, r, t, b, lr, tb, x: xCompare } = getCompLineData(compare)
    const { origin, length } = calcLineValues(
      { x, y },
      target,
      compare,
      lineKey
    )

    const result = {
      near: false,
      // 距离
      dist: 3,
      // 坐标
      value: 0,
      length,
      origin,
    }

    switch (direction) {
      case 'lr': {
        const sides: { dist: number; value: number }[] = []
        sides.push({ dist: x - r, value: r }) // right side
        sides.push({ dist: x + W - xCompare, value: l }) // left side
        sides.forEach((side) => {
          if (Math.abs(side.dist) < Math.abs(result.dist)) {
            result.dist = side.dist
            result.value = side.value
          }
        })
        break
      }
      case 'll':
        result.dist = x - l
        result.value = l
        break
      case 'rr':
        result.dist = x + W - r
        result.value = r
        break
      case 'tt':
        result.dist = y - t
        result.value = t
        break
      case 'bb':
        result.dist = y + H - b
        result.value = b
        break
      case 'tb': {
        const sides: { dist: number; value: number }[] = []
        sides.push({ dist: y + H - t, value: t }) // top side
        sides.push({ dist: y - b, value: b }) // bottom side
        sides.forEach((side) => {
          if (Math.abs(side.dist) < Math.abs(result.dist)) {
            result.dist = side.dist
            result.value = side.value
          }
        })
        break
      }
      case 'mv': // middle vertical
        result.dist = y + H / 2 - tb
        result.value = tb
        break
      case 'mh': // middle horizontal
        result.dist = x + W / 2 - lr
        result.value = lr
        break
    }

    if (Math.abs(result.dist) < 6) {
      result.near = true
    }
    if (result.near) {
      result.direction = direction
    }
    return result
  }

  const calcPosValues = (pos, target, compares, lineKey) => {
    const results = {}

    const directions = {
      x: ['ll', 'rr', 'lr', 'rl', 'mh'],
      y: ['tt', 'bb', 'tb', 'mv'],
    }

    const validDirections = directions[lineKey]
    compares.forEach((compare) => {
      validDirections.forEach((dire) => {
        const { near, dist, value, origin, length } = calcPosValuesSingle(
          pos,
          dire,
          target,
          compare,
          lineKey
        )
        if (near) {
          checkArrayWithPush(results, dist, {
            near,
            lineKey,
            dist,
            i: compare.uuid,
            value,
            origin,
            length,
          })
        }
      })
    })

    const resultArray = Object.entries(results)
    if (resultArray.length) {
      const [minDistance, activeCompares] = resultArray.sort(
        ([dist1], [dist2]) => Math.abs(dist1) - Math.abs(dist2)
      )[0]
      const dist = parseInt(minDistance)
      return {
        v: pos[lineKey] - dist,
        dist: dist,
        lines: activeCompares,
        indices: activeCompares.map(({ i }) => i),
      }
    }

    return {
      v: pos[lineKey],
      dist: 0,
      lines: [],
      indices: [],
    }
  }

  const calcLines = (pos, target, compares) => {
    const { indices: indices_x, lines: xLines } = calcPosValues(
      pos,
      target,
      compares,
      'x'
    )
    const { indices: indices_y, lines: yLines } = calcPosValues(
      pos,
      target,
      compares,
      'y'
    )

    // 匹配line
    const indices = [...new Set([...indices_x, ...indices_y])]
    if (xLines.length && yLines.length) {
      xLines.map((line) => {
        const compare = compares.find(({ uuid }) => uuid === line.i)
        const { length, origin } = calcLineValues(pos, target, compare, 'x')
        line.length = length
        line.origin = origin
        return line
      })
      yLines.map((line) => {
        const compare = compares.find(({ uuid }) => uuid === line.i)
        const { length, origin } = calcLineValues(pos, target, compare, 'y')

        line.length = length
        line.origin = origin

        return line
      })
    }
    steState({
      xLines,
      yLines,
      indices,
    })
  }

  useEffect(() => {
    if (direction) {
      calcLines({ x: direction.x, y: direction.y }, target, compares)
    } else {
      steState({
        xLines: [],
        yLines: [],
        indices: [],
      })
    }
  }, [direction])

  return (
    <>
      {state.xLines.map(({ length, value, origin }, i) => {
        return (
          <>
            {value > 0 && (
              <span
                className="v-line"
                key={`v-${i}`}
                style={{
                  left: value,
                  top: origin,
                  height: length,
                  width: 2,
                  zIndex: 999,
                  ...commonStyle,
                }}
              />
            )}
          </>
        )
      })}
      {state.yLines.map(({ length, value, origin }, i) => {
        return (
          <>
            {value > 0 && (
              <span
                className="h-line"
                key={`h-${i}`}
                style={{
                  top: value,
                  left: origin,
                  width: length,
                  height: 2,
                  zIndex: 999,
                  ...commonStyle,
                }}
              />
            )}
          </>
        )
      })}
    </>
  )
}

export default MarkLine
