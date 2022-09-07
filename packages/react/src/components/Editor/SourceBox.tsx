import { BulbFilled } from '@ant-design/icons'
import type { CSSProperties, FC, ReactNode } from 'react'
import { memo, useCallback, useMemo, useState } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { ComponentItem } from '../../types'

import { Colors } from './Colors'

export interface SourceBoxProps {
  component: ComponentItem
  color: string
  children?: ReactNode
  current: string
}

export const SourceBox = ({ color, children, component, current }) => {
  console.log([component, current], 'srouce')
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: color,
      item: component,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [color, component]
  )

  const backgroundColor = useMemo(() => {
    console.log(current, 'current 000')
    switch (current) {
      case 'text':
        return 'white'
      default:
        return ''
    }
  }, [component])

  const containerStyle = useMemo(
    () => ({
      ...component.style,
      width: '100%',
      height: '100%',
      backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor: 'move',
    }),
    [isDragging]
  )

  return (
    <div
      ref={drag}
      className="inline-flex justify-center items-center border-2 border-purple-500 hover:border-gray-500"
      style={containerStyle}
      role="SourceBox"
      data-color={color}
    >
      {children}
    </div>
  )
}
