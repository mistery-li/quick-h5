<script setup lang="ts">
  import { computed, ref, watch, nextTick, reactive } from 'vue'
  import type { CSSProperties } from 'vue'
  import { throttle } from 'lodash'

  import { IComponent } from '../../types'
  import ShapePoint from './ShapePoint.vue'
  import { useComponentStore } from '../../store/component'
  import { useCommonStore } from '../../store/common'
  import MarkerLine from './MarkerLine.vue'

  const props = defineProps<{
    element: IComponent
    zIndex: number
    style: CSSProperties
  }>()

  const shapeRef = ref<HTMLElement>()

  const componentStore = useComponentStore()

  const getShapeStyle = (style: CSSProperties): CSSProperties => {
    const result: any = {
      zIndex: props.zIndex,
    }
    ;(
      ['width', 'height', 'top', 'left', 'transform'] as Array<
        keyof typeof style
      >
    ).forEach((attr) => {
      if (attr !== 'transform') {
        result[attr] = style[attr] + 'px'
      } else {
        result[attr] = style[attr]
      }
    })
    return result
  }

  const style = computed(() => props.element.style)

  const commonStore = useCommonStore()

  const moveState = reactive({
    isStart: false,
    isMove: false,
    pos: {
      x: 0,
      y: 0,
    },
  })

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    componentStore.setCurComponent(props.element)
    moveState.isStart = true
    const editorRect = document
      .getElementById('editor')
      ?.getBoundingClientRect()
    const { left, top } = editorRect!

    const { offsetX, offsetY } = event

    const handleMove = throttle((moveEvent: MouseEvent) => {
      commonStore.isMove = true
      const { clientX: moveX, clientY: moveY } = moveEvent
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY)
      if (!elemBelow) return
      // 编辑器偏移量和鼠标偏移量 得出具体的坐标
      const transX = moveX - left - offsetX
      const transY = moveY - top - offsetY
      const maxMove = {
        x: 375 - (style.value.width as number),
      }
      const movePos = {
        x: transX < 0 ? 0 : transX > maxMove.x ? maxMove.x : transX,
        y: transY < 0 ? 0 : transY,
      }
      componentStore.curComponent!.x = movePos.x
      componentStore.curComponent!.y = movePos.y
      style.value.transform = `translate3d(${movePos.x}px, ${movePos.y}px, 0)`
      moveState.pos = {
        x: movePos.x,
        y: movePos.y,
      }
    }, 50)

    const handleMouseUp = () => {
      console.log('up')
      moveState.isStart = false
      moveState.isMove = false
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const isRefresh = ref(true)

  // componentStore.$subscribe()

  watch(
    () => componentStore.curComponent,
    () => {
      console.log('cur update')
      isRefresh.value = false
      nextTick(() => {
        isRefresh.value = true
      })
    }
  )

  const points = computed(() => {
    if (componentStore.curComponent) {
      return [
        {
          direction: 'l',
          cursor: 'w-resize',
        },
        {
          direction: 't',
          cursor: 'n-resize',
        },
        {
          direction: 'r',
          cursor: 'e-resize',
        },
        {
          direction: 'b',
          cursor: 's-resize',
        },
        {
          direction: 'lt',
          cursor: 'nw-resize',
        },
        {
          direction: 'lb',
          cursor: 'sw-resize',
        },
        {
          direction: 'rt',
          cursor: 'ne-resize',
        },
        {
          direction: 'rb',
          cursor: 'se-resize',
        },
      ]
    } else {
      return []
    }
  })
</script>

<template>
  <div
    ref="shapeRef"
    :style="getShapeStyle(style)"
    class="shape"
    @mousedown="onMouseDown"
  >
    <slot></slot>
  </div>
  <MarkerLine
    :is-start="moveState.isStart"
    :is-move="moveState.isMove"
    :pos="moveState.pos"
  ></MarkerLine>
  <template v-if="isRefresh">
    <ShapePoint
      v-for="point in points"
      :key="point.direction"
      :direction="point.direction"
      :cursor="point.cursor"
      :cur-component="componentStore.curComponent"
    ></ShapePoint>
  </template>
</template>

<style lang="scss" scoped>
  .shape {
    position: absolute;

    &:hover {
      cursor: move;
    }
  }
</style>
