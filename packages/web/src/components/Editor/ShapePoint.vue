<script setup lang="ts">
  import { computed, CSSProperties } from 'vue'
  import { cloneDeep } from 'lodash'

  import { getNeedsPxStyles } from '../../utils/styles'
  import calculateComponentPositonAndSize from '../../utils/calcPointPos'
  import { IComponent, direKeys, customStyle } from '../../types'
  import { useStore } from '../../store'

  const props = defineProps<{
    direction: direKeys
    cursor: string
    curComponent: IComponent | null
  }>()
  const store = useStore()

  const getPointStyles = computed(() => {
    const defaultSize = 0
    const style: CSSProperties = {
      cursor: props.cursor,
    }
    if (!store.curComp) return style
    const { width, height } = store.curComp?.style!
    const newWidth = Number(width)
    const newHeight = Number(height)
    const halfWidth = newWidth / 2
    const halfHeight = newHeight / 2
    console.log('render pointer')
    switch (props.direction) {
      case 'l':
        style.left = 0
        style.top = halfHeight
        break
      case 't':
        style.left = halfWidth - defaultSize
        style.top = 0
        break
      case 'r':
        style.left = width
        style.top = halfHeight
        break
      case 'b':
        style.left = halfWidth
        style.top = newHeight
        break
      case 'lt':
        style.left = 0
        style.top = 0
        break
      case 'lb':
        style.left = 0
        style.top = newHeight
        break
      case 'rt':
        style.left = newWidth
        style.top = 0
        break
      case 'rb':
        style.left = newWidth
        style.top = newHeight
    }

    return getNeedsPxStyles(style)
  })

  const onMouseDown = (point: direKeys, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const pointRect = (event.target as HTMLElement).getBoundingClientRect()

    const startPosition = {
      x: Math.round(pointRect.left),
      y: Math.round(pointRect.top),
    }

    let moveCount = 0

    const _style = cloneDeep(store.curComp?.style!)

    const startData = cloneDeep(store.curComp!)

    const handleComponentResize = (moveEvent: MouseEvent) => {
      moveCount++
      if (moveCount % 2 === 0) return
      const { clientX: moveX, clientY: moveY } = moveEvent
      const curPositon = {
        x: moveX - startPosition.x,
        y: moveY - startPosition.y,
      }
      const { width, height, x, y, isMove } = calculateComponentPositonAndSize(
        point,
        _style,
        curPositon,
        {
          x: _style.left as number,
          y: _style.top as number,
        }
      )
      const style: customStyle = {
        ..._style,
        width,
        height,
      }
      if (isMove) {
        style.left = x
        style.top = y
        store.updateSelectedCompDataAnyStyles({ x, y }, style)
      } else {
        store.updateSelectedCompStyle(style)
      }
    }

    const handleMouseUp = () => {
      store.addHistory({
        type: 'update',
        value: [startData, cloneDeep(store.curComp!)],
      })
      document.removeEventListener('mousemove', handleComponentResize)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleComponentResize)
    document.addEventListener('mouseup', handleMouseUp)
  }
</script>

<template>
  <div
    ref="pointRef"
    class="shape-point"
    :data-dire="props.direction"
    :style="{ ...getPointStyles, cursor: props.cursor }"
    @mousedown="onMouseDown(props.direction, $event)"
  ></div>
</template>

<style lang="scss" scoped>
  .shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 100;
    margin: -4px;
  }
</style>
