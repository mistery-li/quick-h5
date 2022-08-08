<script setup lang="ts">
  import { computed, reactive } from 'vue'

  const props = defineProps<{
    direction: 'up' | 'left' | 'right'
  }>()

  const lineSize = reactive({
    width: 0,
    height: 0,
  })

  const lines = computed(() => {
    const maxWidth = props.direction === 'up' ? 1050 : 1000
    const multipleLines = maxWidth / 10
    return multipleLines
  })
</script>

<template>
  <div class="rule-line-wrap">
    <div
      class="ruler-line"
      :class="props.direction === 'up' ? 'x-line' : 'y-line'"
    >
      <span
        v-for="(item, index) in lines"
        :key="item"
        :class="[
          props.direction !== 'up' ? 'y-line-item' : 'x-line-item',
          index % 5 === 0
            ? `${props.direction === 'up' ? 'x' : 'y'}-big-line`
            : '',
        ]"
      >
        <span
          class="line-number"
          :class="[
            props.direction === 'up' ? 'x-line-number' : 'y-line-number',
          ]"
        >
          {{ index % 5 === 0 ? index * 10 : '' }}
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .rule-line-wrap {
    padding-bottom: 50px;
    .y-line {
      flex-direction: column;
    }
    .x-line {
      padding-left: 50px;
    }
    .ruler-line {
      display: flex;
      gap: 9px;
      padding-bottom: 50px;
      position: fixed;
      .y-line-item {
        background-color: rgb(204, 204, 204);
        width: 6px;
        height: 1px;
        display: inline-block;
        transform: translateY(0px);
      }
      .x-line-item {
        background-color: rgb(204, 204, 204);
        width: 1px;
        height: 6px;
        display: inline-block;
        transform: translateY(0px);
      }
      .line-number {
        position: absolute;
      }
      .x-line-number {
        top: 15px;
        left: -8px;
      }
      .y-line-number {
        top: -8px;
        left: 15px;
      }
      .x-big-line {
        position: relative;
        height: 12px;
      }
      .y-big-line {
        position: relative;
        width: 12px;
      }
    }
  }
</style>
