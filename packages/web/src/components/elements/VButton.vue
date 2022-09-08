<script setup lang="ts">
  import { IComponent } from '../../types'
  const props = defineProps<{
    element: IComponent
  }>()
</script>

<template>
  <button>{{ props.element.propValue }}</button>
</template>

<style lang="scss" scoped></style>
