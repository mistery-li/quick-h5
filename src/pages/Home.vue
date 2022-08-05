<script setup lang="ts">
  import { NLayout, NLayoutSider, NLayoutContent, NSpace } from 'naive-ui'
  import Components from '../components/Components.vue'
  import Editor from '../components/Editor/index.vue'
  import Styles from '../components/panel/Styles.vue'
</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider size="large">
      <n-layout-sider bordered content-style="padding: 24px;">
        <Components />
      </n-layout-sider>
      <n-layout has-sider sider-placement="right">
        <n-layout-content
          content-style="padding: 24px;"
          class="bg-gray-200 h-screen"
        >
          <Editor />
        </n-layout-content>
        <n-layout-sider
          collapse-mode="width"
          :collapsed-width="0"
          :width="350"
          :native-scrollbar="true"
          show-trigger="arrow-circle"
          content-style="padding: 24px;"
          bordered
        >
          <Styles />
        </n-layout-sider>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
  }
</style>
