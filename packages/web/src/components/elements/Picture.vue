<script setup lang="ts">
  import { IComponent } from '../../types'

  const props = defineProps<{
    element: IComponent
  }>()
</script>

<template>
  <div class="base-element-image" :style="{ ...props.element.style }">
    <div
      class="element-rotate"
      :style="{ transform: `rotate(${props.element.style.rotate}deg)` }"
    >
      <div class="element-content">
        <img class="image" :src="props.element.propValue" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .image {
    width: 100%;
    height: 100%;
  }
</style>
