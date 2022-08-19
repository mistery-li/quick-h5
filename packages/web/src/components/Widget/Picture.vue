<script setup lang="ts">
  import { IComponent } from '../../types'

  const props = defineProps<{
    element: IComponent
  }>()
</script>

<template>
  <div class="image-wrap">
    <img class="image" :src="props.element.propValue" alt="" />
  </div>
</template>

<style lang="scss" scoped>
  .image {
    width: 100%;
    height: 100%;
  }
</style>
