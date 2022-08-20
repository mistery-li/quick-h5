<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import type { Component } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import { cloneDeep } from 'lodash'

  import { IComponent, direKeys } from '../../types'

  import Shape from './Shape.vue'
  import ShapePoint from './ShapePoint.vue'
  import VButton from '../Widget/VButton.vue'
  import VText from '../Widget/VText.vue'
  import Picture from '../Widget/Picture.vue'

  import { getStyle } from '../../utils/utils'
  import { useCommonStore } from '../../store/common'
  import { useStore } from '../../store'
  import { COMPONENTS } from '../../constans'

  type Point = {
    direction: direKeys
    cursor: string
  }

  const store = useStore()

  const editorRef = ref<HTMLElement | null>(null)

  let editorRect: DOMRect | undefined
  onMounted(() => {
    editorRect = editorRef.value?.getBoundingClientRect()
  })

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const element = JSON.parse(event.dataTransfer!.getData('element'))
    const start: { offsetX: number; offsetY: number } = JSON.parse(
      event.dataTransfer!.getData('start')
    )
    // 获取拖拽进来的组件数据
    const component: IComponent = cloneDeep(element)
    component.uuid = uuidv4()
    const { clientX, clientY } = event
    const { x, y } = editorRect as DOMRect
    // 减去拖拽开始时候的鼠标坐标，避免位置偏移
    const transX = clientX - x - start.offsetX
    const transY = clientY - y - start.offsetY
    const editorStyles = store.canvas.styles
    // 放下组件时候如果位置+长度超出画布则至于左侧尽头
    const calcTransX =
      transX < 0
        ? 0
        : transX + (component.style.width as number) > editorStyles.width
        ? editorStyles.width - (component.style.width as number)
        : transX

    component.x = calcTransX
    component.y = transY
    component.style.left = calcTransX
    component.style.top = transY
    if (clientY + (component.style.height as number) > 700) {
      store.updateCanvasStyles({
        height: editorStyles.height + (component.style.height as number),
      })
    }
    store.addComp(component)
  }

  // const curComponent = ref<IComponent | null>(null)

  const onDragOVer = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'copy'
  }

  const componentMap: Record<string, Component> = {
    VButton,
    VText,
    Picture,
  }

  const getComponentStyle = <
    T extends Partial<{ [key in keyof CSSStyleDeclaration]: string | number }>
  >(
    style: T
  ) => {
    const styles = getStyle(style, ['top', 'left', 'transform'])
    return styles
  }

  const points = computed<Point[]>(() => {
    if (store.curComp) {
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
    id="editor"
    ref="editorRef"
    :style="{ ...getComponentStyle(store.canvas.styles), ...store.page.style }"
    class="bg-white m-auto relative"
    @drop="onDrop"
    @dragover="onDragOVer"
  >
    <!-- <MarkLine :threshold="5"></MarkLine> -->
    <ShapePoint
      v-for="point in points"
      :key="point.direction"
      :direction="point.direction"
      :cursor="point.cursor"
      :cur-component="store.curComp"
    ></ShapePoint>
    <Shape
      v-for="(item, index) in store.comps"
      :key="item.uuid"
      :z-index="index"
      :element="item"
    >
      <component
        :is="componentMap[item.component]"
        class="component"
        :element="item"
        :style="getComponentStyle(item.style)"
      ></component>
    </Shape>
  </div>
</template>

<style lang="scss" scoped>
  #editor {
    background-size: 15.625px 15.625px;
    background-repeat: repeat;
    background-image: linear-gradient(
        90deg,
        rgb(240, 240, 240) 5%,
        transparent 0px
      ),
      linear-gradient(rgb(240, 240, 240) 5%, transparent 0px);
  }
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
</style>
