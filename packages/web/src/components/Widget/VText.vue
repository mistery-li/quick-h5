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

  const data = ref(props.element.propValue)

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
    v-model="data"
    :placeholder="props.element.propValue"
    @blur="onCancelInput"
  />
</template>

<style lang="scss" scoped></style>
