<script setup lang="ts">
  import { ref, onMounted, watchEffect } from 'vue'
  import type { Component } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import { cloneDeep } from 'lodash'

  import { IComponent, direKeys } from '../../types'

  import Shape from './Shape.vue'
  import ShapePoint from './ShapePoint.vue'
  import VButton from '../elements/VButton.vue'
  import VText from '../elements/VText.vue'
  import Picture from '../elements/Picture.vue'

  import { getStyle } from '../../utils/utils'

  import { pageElement } from '../../types/elements'

  import useCreateElement from '../../hooks/useCreateElement'
  import { storeToRefs } from 'pinia'
  import { usePagesStore } from '../../store/pages'
  import { useMainStore } from '../../store/main'

  const editorRef = ref<HTMLElement | null>(null)

  let editorRect: DOMRect | undefined
  onMounted(() => {
    editorRect = editorRef.value?.getBoundingClientRect()
  })

  const { currentPage } = storeToRefs(usePagesStore())
  const { createElement } = useCreateElement()
  const mainStore = useMainStore()

  const { handleElementId, activeElementIds } = storeToRefs(mainStore)

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const element = JSON.parse(event.dataTransfer!.getData('element'))
    const start: { offsetX: number; offsetY: number } = JSON.parse(
      event.dataTransfer!.getData('start')
    )
    // 获取拖拽进来的组件数据
    const elementData: pageElement = cloneDeep(element)
    elementData.id = uuidv4()
    const { clientX, clientY } = event
    const { x, y } = editorRect as DOMRect
    // 减去拖拽开始时候的鼠标坐标，避免位置偏移
    const left = clientX - x - start.offsetX
    const top = clientY - y - start.offsetY
    elementData.style.left = left
    elementData.style.top = top
    createElement(elementData)
  }

  // const curComponent = ref<IComponent | null>(null)

  const onDragOVer = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'copy'
  }

  const handleClickBlankArea = (e: Event) => {
    console.log(e, 'e')
    e.stopPropagation()
    mainStore.setActiveElementIds([])
    mainStore.setHandleElementId('')
  }

  const componentMap: Record<string, Component> = {
    VButton,
    VText,
    Picture,
  }

  const elementList = ref([])
  const setLocalElements = () => {
    elementList.value = currentPage.value
      ? cloneDeep(currentPage.value.elements)
      : []
  }
  watchEffect(setLocalElements)

  const getComponentStyle = <
    T extends Partial<{ [key in keyof CSSStyleDeclaration]: string | number }>
  >(
    style: T
  ) => {
    const styles = getStyle(style, ['top', 'left', 'transform'])
    return styles
  }
</script>

<template>
  <div
    class="editor-wrapper"
    @click.self="handleClickBlankArea"
    @drop="onDrop"
    @dragover="onDragOVer"
  >
    <div
      id="editor"
      @click.self="handleClickBlankArea"
      ref="editorRef"
      :style="{
        width: '375px',
        height: '800px',
      }"
      class="bg-white m-auto relative"
    >
      <Shape
        v-for="(element, index) in elementList"
        :key="element.id"
        :z-index="index"
        :select="activeElementIds.includes(element.id)"
        :element="element"
        :active="handleElementId === element.id"
      >
        <component
          :is="componentMap[element.component]"
          class="component"
          :element="element"
          :style="getComponentStyle(element.style)"
        ></component>
      </Shape>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .editor-wrapper {
    height: calc(100vh - 60px);
    background: #d9d9d9;
  }
  #editor {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
</style>
