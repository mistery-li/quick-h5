<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { CSSProperties } from 'vue'
  import { cloneDeep } from 'lodash'
  import { NPopover, NList, NListItem, NButton } from 'naive-ui'

  import { IComponent } from '../../types'
  import { useCommonStore } from '../../store/common'
  import MarkerLine from './MarkerLine.vue'
  import { useStore } from '../../store'

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
    if (!commonStore.isEdit) return
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
    const startData = cloneDeep(store.curComp)

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
        value: [startData, cloneDeep(store.curComp)],
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
    :class="[commonStore.isEdit ? 'edit' : '']"
    @contextmenu="onContextMenu(props.element, $event)"
    @mousedown="onMouseDown"
  >
    <slot></slot>
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
  .edit {
    &:hover {
      cursor: move;
    }
  }
  ::v-deep .n-list-item {
    padding: 0px;
  }
</style>
