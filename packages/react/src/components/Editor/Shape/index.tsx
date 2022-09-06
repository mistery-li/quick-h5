import { useDispatch, useSelector } from 'react-redux'
import React, { useRef, useState, useCallback, useEffect } from 'react'

import { Dropdown, Menu } from 'antd'
import type { MenuProps } from 'antd'

import ShapePoint from '../ShapePoint'
import styles from './index.module.less'

import { getCurComp } from '../../../store/components'

interface ShapeProps {
  key?: number
  index: number
  children: React.ReactNode
  style: Record<string, any>
  componentData: Record<string, any>
}

const Shape = ({ index, children, style, componentData }: ShapeProps) => {
  const dispatch = useDispatch()
  const curComp = useSelector((state) => getCurComp(state))

  const selectComponent = () => {
    dispatch(setCurComp(componentData))
  }

  const handleClickMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'delete') {
      // components.splice(index, 1);
      dispatch(filterComponentsByIndex(index))
    }
  }

  const menu = (
    <Menu
      onClick={handleClickMenu}
      items={[
        {
          label: '删除',
          key: 'delete',
        },
      ]}
    />
  )

  const pointList =
    curComponent && curComponent.uuid === componentData.uuid
      ? ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']
      : []

  const shapeRef = useRef<HTMLElement>()

  const newStyles = { ...style }

  const [state, setState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    left: style?.left || 0,
    top: style?.top || 0,
  })
  // mouse move
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (curComponent) {
        event.preventDefault()
      }
      const { clientX, clientY } = event
      if (state.isDragging) {
        const rectInfo = document
          .getElementById('editor')!
          .getBoundingClientRect()

        const top = clientY - rectInfo?.y - state.startY
        const left = clientX - rectInfo?.x - state.startX
        const shapeRectInfo: DOMRect = shapeRef.current!.getBoundingClientRect()
        const isMoveToTop =
          clientY - shapeRectInfo.top - state.startY > 0 ? false : true
        const isMoveToLeft =
          clientX - shapeRectInfo.left - state.startX > 0 ? false : true
        const moveDirection = {
          isMoveToTop,
          isMoveToLeft,
          left: !isMoveToLeft ? left + style.width : left,
          top: !isMoveToTop ? top + style.height : top,
        }
        dispatch(setShapeStyle({ ...style, left, top }))
        dispatch(setMoveDirection(moveDirection))
        // setState((prevState) => ({
        //   ...prevState,
        //   left,
        //   top,
        // }));
      }
    },
    [state.isDragging]
  )

  // mouse left click release
  const handleMouseUp = useCallback(() => {
    // dispatch(setCurComponent(null));
    setState((prevState) => {
      return {
        ...prevState,
        isDragging: false,
      }
    })
  }, [state.isDragging])

  // mouse left click hold
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event?.stopPropagation()
    const { clientX, clientY } = event
    dispatch(setCurComponent(componentData))
    const shapeRectInfo: DOMRect = shapeRef.current!.getBoundingClientRect()
    setState((prevState) => ({
      ...prevState,
      startX: clientX - shapeRectInfo?.left,
      startY: clientY - shapeRectInfo?.top,
      isDragging: true,
    }))
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div
        className={[
          styles.shape,
          'inline-block',
          curComponent && curComponent.uuid === componentData.uuid
            ? styles.active
            : '',
        ]}
        onClick={selectComponent}
        ref={shapeRef}
        style={{
          ...newStyles,
          position: 'absolute',
          left: `${newStyles.left}px`,
          top: `${newStyles.top}px`,
          zIndex: index,
        }}
        onMouseDown={handleMouseDown}
      >
        {pointList.map((point) => (
          <ShapePoint key={point} point={point} propStyles={style}></ShapePoint>
        ))}
        {children}
      </div>
    </Dropdown>
  )
}

export default Shape
