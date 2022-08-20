<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { NSpace, NButton, useMessage } from 'naive-ui'

  import Preview from './Preview.vue'
  import { useStore } from '../store'

  const store = useStore()
  const isPreview = ref(false)
  const message = useMessage()
  const onPreview = () => {
    if (store.comps.length === 0) {
      message.warning('暂无可预览部件')
      return
    }
    const previeData = {
      data: store.page,
      comps: store.comps,
    }
    sessionStorage.setItem('previewData', JSON.stringify(previeData))
    isPreview.value = true
  }

  const onClear = () => {
    store.clearCanvas()
  }

  const handleUndo = () => {
    store.undo()
  }

  const handleRedo = () => {
    store.redo()
  }

  const canRedo = computed(() => store.current + 1 === store.history.length)
</script>

<template>
  <n-space justify="center" class="pt-2">
    <n-button @click="onClear">清空</n-button>
    <n-button @click="onPreview">预览</n-button>
    <n-button @click="handleUndo" :disabled="store.current === -1"
      >撤销</n-button
    >
    <n-button @click="handleRedo" :disabled="canRedo">重做</n-button>
  </n-space>
  <Preview v-if="isPreview" v-model="isPreview"></Preview>
</template>

<style lang="scss" scoped></style>
