<script setup lang="ts">
  import { ref } from 'vue'
  import { NSpace, NButton } from 'naive-ui'
  import { useCommonStore } from '../store/common'
  import { useComponentStore } from '../store/component'
  import Preview from './Preview.vue'

  const commonStore = useCommonStore()
  const componentStore = useComponentStore()
  const isPreview = ref(false)
  const onPreview = () => {
    // componentStore.curComponent = null
    const components = componentStore.components
    console.log(components, 'components')
    localStorage.setItem('previewData', JSON.stringify(components))
    console.log(222)
    isPreview.value = true
  }

  const onClear = () => {
    componentStore.setCurComponent(null)
    componentStore.components = []
  }
</script>

<template>
  <n-space justify="center" class="pt-2">
    <n-button @click="onClear">清空</n-button>
    <n-button @click="onPreview">预览</n-button>
  </n-space>
  <Preview v-model="isPreview"></Preview>
</template>

<style lang="scss" scoped></style>
