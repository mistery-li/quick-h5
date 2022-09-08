<script setup lang="ts">
  import { ref } from 'vue'

  import { IComponent } from '../../types'

  const props = defineProps<{
    element: any
  }>()
  console.log(props, 'props')
</script>

<template>
  <div class="base-element-text" :style="{ ...props.element.style }">
    <div
      class="element-rotate"
      :style="{ transform: `rotate(${props.element.style.rotate}deg)` }"
    >
      <div class="element-content">
        <input class="image" :value="props.element.propValue" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
