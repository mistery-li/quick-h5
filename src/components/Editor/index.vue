<script setup lang="ts">
  import { CSSProperties, reactive, ref, onMounted, watch } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import { cloneDeep } from 'lodash'
  import { storeToRefs } from 'pinia'

  import { components } from '../../config/componentData'
  import { IComponent } from '../../types'

  import Shape from './Shape.vue'
  import VButton from '../Widget/VButton.vue'
  import VText from '../Widget/VText.vue'
  import Picture from '../Widget/Picture.vue'

  import { getStyle } from '../../utils/utils'
  import { useComponentStore } from '../../store/component'

  const defaultSize = reactive({
    width: '375px',
    height: '800px',
  })

  const componentStore = useComponentStore()

  const componentList = componentStore.components
  watch(
    () => componentList,
    (value) => {
      console.log(value, 'componentList update')
    }
  )

  const editorRef = ref<HTMLElement | null>(null)

  let editorRect: DOMRect | undefined
  onMounted(() => {
    editorRect = editorRef.value?.getBoundingClientRect()
  })

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const index = event.dataTransfer!.getData('index')
    const start: { offsetX: number; offsetY: number } = JSON.parse(
      event.dataTransfer!.getData('start')
    )
    // 获取拖拽进来的组件数据
    const component: IComponent = cloneDeep(components[parseInt(index)])
    component.uuid = uuidv4()
    const { clientX, clientY } = event
    const { x, y } = editorRect as DOMRect
    // 减去拖拽开始时候的鼠标坐标，避免位置偏移
    const transX = clientX - x - start.offsetX
    const transY = clientY - y - start.offsetY
    const calcTransX =
      transX < 0
        ? 0
        : transX + (component.style.width as number) >
          parseInt(defaultSize.width)
        ? parseInt(defaultSize.width) - (component.style.width as number)
        : transX

    component.x = calcTransX
    component.y = transY
    // 放下组件时候如果位置+长度超出画布则至于左侧尽头
    // component.style.left =
    //   transX < 0
    //     ? 0
    //     : transX + (component.style.width as number) >
    //       parseInt(defaultSize.width)
    //     ? parseInt(defaultSize.width) - (component.style.width as number)
    //     : transX
    // component.style.top = transY
    component.style.transform = `translate3d(${
      transX < 0
        ? 0
        : transX + (component.style.width as number) >
          parseInt(defaultSize.width)
        ? parseInt(defaultSize.width) - (component.style.width as number)
        : transX
    }px,${transY}px, 0)`
    if (clientY + (component.style.height as number) > 700) {
      defaultSize.height =
        parseFloat(defaultSize.height) +
        (component.style.height as number) +
        'px'
    }
    console.log(component, 'component')
    componentList.push(component)
  }

  // const curComponent = ref<IComponent | null>(null)

  const onDragOVer = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'copy'
  }

  const componentMap = {
    VButton,
    VText,
    Picture,
  }

  const getComponentStyle = (style: CSSProperties) => {
    const styles = getStyle(style, ['top', 'left', 'transform'])
    return styles
  }

  const onMouseDown = (event: MouseEvent) => {
    console.log(event, 'event')
    console.log('mouse down')
    if (event.button !== 2) {
      componentStore.curComponent = null
    }
  }
</script>

<template>
  <div
    id="editor"
    ref="editorRef"
    :style="defaultSize"
    class="bg-white m-auto relative"
    @drop="onDrop"
    @dragover="onDragOVer"
    @mousedown="onMouseDown"
  >
    <Shape
      v-for="(item, index) in componentList"
      :key="item.uuid"
      :style="getComponentStyle(item.style)"
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
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
</style>
