<script setup lang="ts">
  import { CSSProperties, nextTick } from 'vue'
  import { cloneDeep } from 'lodash'

  import { getNeedsPxStyles } from '../../utils/styles'
  import { useComponentStore } from '../../store/component'
  import { useCommonStore } from '../../store/common'
  import calculateComponentPositonAndSize from '../../utils/calcPointPos'
  import { IComponent } from '../../types'
  import { storeToRefs } from 'pinia'

  type direKeys = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l'

  const props = defineProps<{
    direction: direKeys
    cursor: string
    curComponent: IComponent | null
  }>()

  const componentStore = useComponentStore()
  const curComponent = componentStore.curComponent!

  const { editorRect } = storeToRefs(useCommonStore())

  const getPointStyles = () => {
    const defaultSize = 0
    const style: CSSProperties = {
      cursor: props.cursor,
    }
    if (!curComponent) return style
    const {
      x,
      y,
      style: { width, height },
    } = curComponent
    const newWidth = Number(width)
    const newHeight = Number(height)
    const halfWidth = newWidth / 2
    const halfHeight = newHeight / 2
    switch (props.direction) {
      case 'l':
        style.left = x - defaultSize
        style.top = y + halfHeight - defaultSize
        break
      case 't':
        style.left = x + halfWidth - defaultSize
        style.top = y - defaultSize
        break
      case 'r':
        style.left = x + newWidth - defaultSize
        style.top = y + halfHeight - defaultSize
        break
      case 'b':
        style.left = x + halfWidth - defaultSize
        style.top = y + newHeight - defaultSize
        break
      case 'lt':
        style.left = x - defaultSize
        style.top = y - defaultSize
        break
      case 'lb':
        style.left = x - defaultSize
        style.top = y + newHeight - defaultSize
        break
      case 'rt':
        style.left = x + newWidth - defaultSize
        style.top = y - defaultSize
        break
      case 'rb':
        style.left = x + newWidth - defaultSize
        style.top = y + newHeight - defaultSize
    }

    return getNeedsPxStyles(style)
  }

  const onMouseDown = (point: string, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const pointRect = (event.target as HTMLElement).getBoundingClientRect()

    const startPosition = {
      x: Math.round(pointRect.left),
      y: Math.round(pointRect.top),
    }

    let moveCount = 0

    const component = cloneDeep(curComponent)
    console.log(component, 'component')

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
        component.style,
        curPositon,
        {
          x: component.x,
          y: component.y,
        }
      )
      curComponent.style.width = width
      console.log(height, 'wrap height')
      curComponent.style.height = height
      if (isMove) {
        curComponent.x = x
        curComponent.y = y
        curComponent!.style!.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }

    const handleMouseUp = () => {
      const index = componentStore.components.findIndex(
        (item) => item.uuid === curComponent.uuid
      )
      nextTick(() => {
        componentStore.$patch((state) => {
          state.components.splice(index, 1, curComponent)
        })
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
    :style="getPointStyles()"
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
