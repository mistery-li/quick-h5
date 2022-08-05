<script setup lang="ts">
  // 编辑器左侧组件列表
  import { components } from '../config/componentData'

  const handleDragStart = (event: DragEvent) => {
    const start = {
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    }
    event.dataTransfer?.setData('index', event.target?.dataset?.index)
    // 记录鼠标拖拽开始偏移量
    event.dataTransfer?.setData('start', JSON.stringify(start))
  }
</script>

<template>
  <div class="component-list flex flex-wrap gap-1" @dragstart="handleDragStart">
    <div
      v-for="(item, index) in components"
      :key="index"
      class="rounded border-solid border-2 text-center border-light-blue-500 w-24 h-24"
      draggable="true"
      :data-index="index"
    >
      <span class="iconfont" :class="'icon-' + item.icon"></span>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
