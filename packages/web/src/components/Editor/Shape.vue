<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import type { CSSProperties } from 'vue'
  import { cloneDeep } from 'lodash'
  import { NPopover, NList, NListItem, NButton, NIcon } from 'naive-ui'
  import { SyncCircleSharp } from '@vicons/ionicons5'

  import { IComponent, direKeys } from '../../types'
  import MarkerLine from './MarkerLine.vue'
  import { useStore } from '../../store'
  import { useRotate } from '../../composable/useRotate'
  import { transformStyls, mod360 } from '../../utils/styles'
  import ShapePoint from './ShapePoint.vue'

  type Point = {
    direction: direKeys
    cursor: string
  }

  const props = defineProps<{
    element: IComponent
    zIndex: number
  }>()

  const shapeRef = ref<HTMLElement>()

  const store = useStore()

  const getShapeStyle = <
    T extends Partial<{ [key in keyof CSSStyleDeclaration]: string | number }>
  >(
    style: T
  ): CSSProperties => {
    const result: any = {
      zIndex: props.zIndex,
    }
    ;(
      ['width', 'height', 'top', 'left', 'rotate'] as Array<keyof typeof style>
    ).forEach((attr) => {
      if (attr !== 'rotate') {
        result[attr] = style[attr] + 'px'
      } else {
        result['transform'] = `rotate(${style[attr]}deg)`
      }
    })
    return result
  }

  const moveState = reactive({
    isStart: false,
    isMove: false,
    pos: {
      x: 0,
      y: 0,
    },
  })

  const onMouseDownOnShape = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (props.element.uuid !== store.curComp?.uuid) {
      store.setSelectComp(props.element)
    }
    moveState.isStart = true
    const editorRect = document
      .getElementById('editor')
      ?.getBoundingClientRect()
    const { left, top } = editorRect!

    const { offsetX, offsetY } = event

    let needToRecord = true
    const startData = cloneDeep(store.curComp!)

    const handleMove = (moveEvent: MouseEvent) => {
      moveState.isMove = true
      needToRecord = false
      const { clientX: moveX, clientY: moveY } = moveEvent
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY)
      if (!elemBelow) return

      const style = { ...props.element.style } as Required<
        Record<keyof CSSProperties, string | number>
      >
      // 编辑器偏移量和鼠标偏移量 得出具体的坐标
      const transX = moveX - left - offsetX
      const transY = moveY - top - offsetY
      const maxMove = {
        x: 375 - (style.width as number),
      }
      const movePos = {
        x: transX < 0 ? 0 : transX > maxMove.x ? maxMove.x : transX,
        y: transY < 0 ? 0 : transY,
      }
      const pos = {
        x: movePos.x,
        y: movePos.y,
      }
      style.left = movePos.x
      style.top = movePos.y
      // style.transform = `translate3d(${movePos.x}px, ${movePos.y}px, 0)`
      moveState.pos = {
        x: movePos.x,
        y: movePos.y,
      }
      store.updateSelectedCompDataAnyStyles(pos, style)
    }

    const handleMouseUp = () => {
      moveState.isStart = false
      moveState.isMove = false
      store.addHistory({
        type: 'update',
        value: [startData, cloneDeep(store.curComp!)],
      })
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const showRightMenu = ref(false)
  const rightMenuPos = reactive({
    x: 0,
    y: 0,
  })
  const onContextMenu = (comp: IComponent, e: MouseEvent) => {
    e.preventDefault()
    store.setSelectComp(comp)
    rightMenuPos.x = e.clientX
    rightMenuPos.y = e.clientY
    showRightMenu.value = true
  }
  /**
   * @todo refactor to useCommand 执行命令执行不同操作，并添加history
   */
  const onCloseRightMenu = () => {
    showRightMenu.value = false
  }

  const onDeleteComp = () => {
    store.deleteCurComp()
    onCloseRightMenu()
  }

  const onSetTop = () => {
    store.setCurCompToTop()
    onCloseRightMenu()
  }
  const onSetBottom = () => {
    store.setCurCompToBottom()
    onCloseRightMenu()
  }

  const setUp = () => {
    store.setCurCompToUp()
    onCloseRightMenu()
  }
  const setDown = () => {
    store.setCurCompToDown()
    onCloseRightMenu()
  }

  const points = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']
  const initialAngle = {
    // 每个点对应的初始角度
    lt: 0,
    t: 45,
    rt: 90,
    r: 135,
    rb: 180,
    b: 225,
    lb: 270,
    l: 315,
  }
  const angleToCursor = [
    // 每个范围的角度对应的光标
    { start: 338, end: 23, cursor: 'nw' },
    { start: 23, end: 68, cursor: 'n' },
    { start: 68, end: 113, cursor: 'ne' },
    { start: 113, end: 158, cursor: 'e' },
    { start: 158, end: 203, cursor: 'se' },
    { start: 203, end: 248, cursor: 's' },
    { start: 248, end: 293, cursor: 'sw' },
    { start: 293, end: 338, cursor: 'w' },
  ]
  const cursors = reactive<any>({})
  const rotateStyle = computed(() => {
    if (store.curComp?.style) {
      const { width, height } = store.curComp?.style
      const _style = {
        left: Number(width) / 2 - 15,
        top: Number(height) + 10,
      }
      return transformStyls(_style)
    }
    return {}
  })

  const { rotate, onMouseDown, moveDone } = useRotate()

  watch(
    () => moveDone.value,
    (val) => {
      if (val) {
        getCursor()
      }
    }
  )

  const getCursor = () => {
    const _rotate = mod360(rotate.value)
    let lastMatchIndex = -1

    points.forEach((point) => {
      const angle = mod360(initialAngle[point] + _rotate)
      const len = angleToCursor.length
      while (true) {
        lastMatchIndex = (lastMatchIndex + 1) % len
        const angleLimit = angleToCursor[lastMatchIndex]
        if (angle < 23 || angle >= 338) {
          cursors[point] = 'nw-resize'

          return
        }

        if (angleLimit.start <= angle && angle < angleLimit.end) {
          cursors[point] = angleLimit.cursor + '-resize'

          return
        }
      }
    })
    console.log(cursors, 'cursor')
  }

  onMounted(() => {
    if (store.curComp) {
      getCursor()
    }
  })
</script>

<template>
  <n-popover
    :show="showRightMenu"
    :x="rightMenuPos.x"
    :y="rightMenuPos.y"
    placement="right-end"
    @clickoutside="onCloseRightMenu"
    trigger="manual"
  >
    <n-list>
      <n-list-item>
        <n-button quaternary> 复制 </n-button>
      </n-list-item>
      <n-list-item>
        <n-button quaternary @click="onDeleteComp">
          删除
        </n-button></n-list-item
      >
      <n-list-item>
        <n-button quaternary @click="onSetTop"> 置顶 </n-button></n-list-item
      >
      <n-list-item>
        <n-button quaternary @click="onSetBottom"> 置底 </n-button></n-list-item
      >
      <n-list-item>
        <n-button quaternary @click="setUp"> 上移 </n-button></n-list-item
      >
      <n-list-item>
        <n-button quaternary @click="setDown"> 下移 </n-button></n-list-item
      >
    </n-list>
  </n-popover>
  <div
    ref="shapeRef"
    :style="getShapeStyle(props.element?.style)"
    class="shape"
    :class="props.element.uuid === store.curComp?.uuid ? 'active' : ''"
    @contextmenu="onContextMenu(props.element, $event)"
    @mousedown="onMouseDownOnShape"
  >
    <slot></slot>
    <template v-if="store.curComp?.uuid === props.element.uuid">
      <ShapePoint
        v-for="point in points"
        :key="point"
        :direction="point"
        :cursor="cursors[point]"
        :cur-component="store.curComp"
      ></ShapePoint>
      <div
        class="rotate-icon inline-block absolute cursor-pointer"
        @mousedown="onMouseDown"
        :style="rotateStyle"
      >
        <n-icon size="28">
          <SyncCircleSharp />
        </n-icon>
      </div>
    </template>
  </div>
  <MarkerLine
    :is-start="moveState.isStart"
    :is-move="moveState.isMove"
    :pos="moveState.pos"
  ></MarkerLine>
</template>

<style lang="scss" scoped>
  .shape {
    position: absolute;
  }
  .active {
    border: 1px solid #0ecac1;
  }
  .edit {
    &:hover {
      cursor: move;
    }
  }
  ::v-deep .n-list-item {
    padding: 0px;
  }
</style>
