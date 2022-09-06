import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { setCurComp, updateComps } from '../../../store/components'
import { ComponentItem } from '../../../types'

import calculateComponentPositonAndSize from '../../../utils/shapePointCalculate'
import styles from './index.module.less'

interface IProps {
  key: string
  point: string
  comp: ComponentItem
}

const ShapePoint = ({ key, point, comp }: IProps) => {
  const dispatch = useDispatch()
  const getPointStyles = (point: string) => {
    const styles = { ...comp.style }
    const { width, height } = styles
    const hasT = /t/.test(point)
    const hasB = /b/.test(point)
    const hasL = /l/.test(point)
    const hasR = /r/.test(point)
    let newLeft = 0
    let newTop = 0
    const widthNumber = Number(width)
    const heightNumber = Number(height)
    const halfWidth = widthNumber / 2
    const halfHeight = heightNumber / 2

    // 四个角的点
    // lt lb rt rb
    if (point.length === 2) {
      newLeft = !hasL ? widthNumber : 0
      newTop = !hasT ? heightNumber : 0
    } else {
      // 上下两点的点，宽度居中
      if (hasT || hasB) {
        newLeft = halfWidth
        newTop = !hasT ? heightNumber : 0
      }

      // 左右两边的点，高度居中
      if (hasL || hasR) {
        newLeft = hasR ? widthNumber : 0
        newTop = halfHeight
      }
    }

    const style = {
      marginLeft: '-4px',
      marginTop: '-4px',
      left: `${newLeft}px`,
      top: `${newTop}px`,
      cursor: getCursor(point),
    }
    return style
  }

  const [style, setStyle] = useState<CSSProperties>()

  useEffect(() => {
    const style = getPointStyles(point)
    setStyle(style)
  }, [point, comp])

  const cursorObj = {
    lt: 'nw-resize',
    t: 'n-resize',
    rt: 'ne-resize',
    r: 'e-resize',
    rb: 'se-resize',
    b: 's-resize',
    lb: 'sw-resize',
    l: 'w-resize',
  }
  const getCursor = (point) => {
    return cursorObj[point]
  }

  const handleShapePointMouseDown = (
    point: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()
    event.preventDefault()

    const pointRect = (event.target as HTMLElement).getBoundingClientRect()

    let isFirst = true

    const startPosition = {
      x: Math.round(
        pointRect.left + (event.target as HTMLElement).offsetWidth / 2
      ),
      y: Math.round(
        pointRect.top + (event.target as HTMLElement).offsetHeight / 2
      ),
    }

    let moveCount = 0

    const move = (moveEvent: MouseEvent) => {
      if (comp.lock) return
      // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
      // 因此第一次点击时不触发 move 事件
      if (isFirst) {
        isFirst = false
        return
      }
      moveCount++
      if (moveCount % 2 === 0) return
      const curPositon = {
        x: moveEvent.clientX - startPosition.x,
        y: moveEvent.clientY - startPosition.y,
      }

      const { styles, pos } = calculateComponentPositonAndSize(
        point,
        comp?.style,
        curPositon,
        comp?.pos
      )
      const cur: ComponentItem = cloneDeep(comp)
      cur.style = styles
      cur.pos = pos
      dispatch(setCurComp(cur))
      dispatch(updateComps())
      // this.$store.commit("setShapeStyle", style);
    }

    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      // needSave && this.$store.commit("recordSnapshot");
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  return (
    <div
      key={key}
      onMouseDown={(event) => handleShapePointMouseDown(point, event)}
      className={styles.shapePoint}
      style={style}
    ></div>
  )
}

export default ShapePoint
