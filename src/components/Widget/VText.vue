<script setup lang="ts">
  import { IComponent } from '../../types'

  const props = defineProps<{
    element: IComponent
  }>()
</script>

<template>
  <div>{{ props.element.propValue }}</div>
</template>

<style lang="scss" scoped></style>
