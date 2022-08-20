<script setup lang="ts">
  import { ref } from 'vue'

  import { IComponent } from '../../types'

  const props = defineProps<{
    element: IComponent
  }>()

  const isInput = ref(false)
  const onStartInput = () => {
    isInput.value = true
  }

  const onCancelInput = () => {
    isInput.value = false
  }
</script>

<template>
  <div v-if="!isInput" @dblclick="onStartInput">
    {{ props.element.propValue }}
  </div>
  <input
    v-else
    v-model="props.element.propValue"
    :placeholder="props.element.propValue"
    @blur="onCancelInput"
  />
</template>

<style lang="scss" scoped></style>
