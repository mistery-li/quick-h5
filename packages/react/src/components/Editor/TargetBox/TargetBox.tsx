import type { DropTargetMonitor } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

import { RootState } from '../../../store'

import { Title, Text, SubTitle } from '../../Widget/Text'

import { Colors } from '../Colors'

import Draggable from 'react-draggable'
import type { DraggableData, DraggableEvent } from 'react-draggable'

import { Resizable } from 'react-resizable'

import { Dropdown, Menu, message } from 'antd'
import type { MenuProps } from 'antd'

import { useMarkerLine } from '../../hook/useMarkerLine'

import ShapePoint from '../ShapePoint'

import styles from './index.module.less'

import {
  getComps,
  getCurComp,
  addComp,
  setCurComp,
  updateComps,
  setCurCompPos,
  getEditorConfig,
  addHistory,
} from '../../../store/components'

import { deepCopy, generateUuid } from '../../../utils/utils'
import { ComponentItem, Nullable } from '../../../types'
import Picture from '../../Widget/Picture'
import MarkLine from '../MarkLine'
import { useState } from 'react'

const TargetBox = () => {
  const dispatch = useDispatch()
  const comps = useSelector((state) => getComps(state))
  const curComp = useSelector((state) => getCurComp(state))
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [Colors.YELLOW, Colors.BLUE],
    drop(_item: ComponentItem, monitor) {
      const result = monitor.getSourceClientOffset()!
      const component = cloneDeep(monitor.getItem())
      const editorRect = document
        .getElementById('editor')
        ?.getBoundingClientRect()!
      const x = result.x - editorRect.x
      const y = result.y < editorRect.y ? 0 : result.y - editorRect.y
      component.pos = {
        x,
        y,
      }
      component.uuid = generateUuid(8, 10)
      dispatch(addComp(component))
      dispatch(setCurComp(component))
      dispatch(
        addHistory({
          type: 'add',
          value: component,
        })
      )
      return {
        name: 'Wdiget',
        allowedDropEffect: 'copy',
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggingColor: monitor.getItemType() as string,
    }),
  }))

  const [pos, setPos] = useState<Nullable<{ x: number; y: number }>>(null)

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    setPos({ x: data.lastX, y: data.lastY })
  }

  const onDragStart = (comp: ComponentItem, data: DraggableData) => {}

  const onMouseDown = (e: MouseEvent, comp: ComponentItem) => {
    // 避免重新触发拖拽事件
    e.preventDefault()
    dispatch(setCurComp(comp))
  }

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    const { lastX, lastY } = data
    const pos = {
      x: lastX,
      y: lastY,
    }
    setPos(null)
    dispatch(setCurCompPos(pos))
    dispatch(updateComps())
    dispatch(
      addHistory({
        type: 'add',
        value: curComp,
      })
    )
  }

  const handleClickMenu: MenuProps['onClick'] = ({ key }) => {
    // if (key === 'delete') {
    //   if (!curComp) {
    //     return message.info('请选择组件')
    //   }
    //   const list = comps.filter((widget) => widget.uuid !== curWidget.uuid)
    //   // setWidgetList(list);
    //   dispatch(setComponents(list))
    //   dispatch(setCurComponent(null))
    // }
  }

  const pointList = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']

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

  const editorConfig = useSelector((state: RootState) => getEditorConfig(state))

  return (
    <div
      id="editor"
      className={`m-auto relative top-20 bg-white ${
        editorConfig.showGrid ? styles['show-grid'] : ''
      }`}
      ref={drop}
      style={{ width: 375, height: 800 }}
      role="TargetBox"
    >
      <MarkLine direction={pos}></MarkLine>
      {comps.map((item, index) => {
        return (
          <>
            <Draggable
              defaultPosition={{ ...item.pos }}
              position={item.pos}
              bounds="parent"
              key={item.uuid}
              disabled={item.lock}
              onStart={(_, data) => onDragStart(item, data)}
              onStop={onDragStop}
              onDrag={onDrag}
              onMouseDown={(e) => onMouseDown(e, item)}
            >
              <div
                className="drag-wrapper absolute cursor-move border-dashed border hover:border-blue-400"
                style={{ ...item.style, zIndex: index }}
              >
                {curComp &&
                  curComp.uuid === item.uuid &&
                  pointList.map((point) => {
                    return (
                      <ShapePoint
                        comp={item}
                        point={point}
                        key={item.uuid + point}
                      ></ShapePoint>
                    )
                  })}
                {item.component === 'title' && <Title isEdit />}
                {item.component === 'subTitle' && <SubTitle isEdit />}
                {item.component === 'text' && <Text isEdit />}
                {item.component === 'image' && (
                  <Picture propValue={item.propValue} styles={item.style} />
                )}
              </div>
            </Draggable>
          </>
        )
      })}
    </div>
  )
}

export default TargetBox
