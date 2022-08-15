<script setup lang="ts">
  import { ref } from 'vue'
  import { NSpace, NButton } from 'naive-ui'
  import { cloneDeep } from 'lodash'

  import { useCommonStore } from '../store/common'
  import { useComponentStore } from '../store/component'
  import Preview from './Preview.vue'

  const commonStore = useCommonStore()
  const componentStore = useComponentStore()
  const isPreview = ref(false)
  const onPreview = () => {
    // componentStore.curComponent = null
    const components = componentStore.components
    localStorage.setItem('previewData', JSON.stringify(components))
    isPreview.value = true
  }

  const onClear = () => {
    componentStore.setCurComponent(null)
    componentStore.components = []
  }

  const handleUndo = () => {
    if (commonStore.counter <= -1) return
    const historyItem = commonStore.history[commonStore.counter]
    if (commonStore.counter === 0 || historyItem.type === 'add') {
      componentStore.components.pop()
    } else {
      componentStore.setComponentData(historyItem.value)
    }
    commonStore.counter = commonStore.counter - 1
  }

  const handleRedo = () => {
    commonStore.counter = commonStore.counter + 1
    const historyItem = commonStore.history[commonStore.counter]
    if (historyItem.type === 'add') {
      componentStore.components.push(historyItem.value)
    } else {
      componentStore.setComponentData(historyItem.value)
    }
  }
</script>

<template>
  <n-space justify="center" class="pt-2">
    <n-button @click="onClear">清空</n-button>
    <n-button @click="onPreview">预览</n-button>
    <n-button @click="handleUndo" :disabled="commonStore.counter === -1"
      >撤销</n-button
    >
    <n-button
      @click="handleRedo"
      :disabled="commonStore.history.length - 1 === commonStore.counter"
      >重做</n-button
    >
  </n-space>
  <Preview v-model="isPreview"></Preview>
</template>

<style lang="scss" scoped></style>
