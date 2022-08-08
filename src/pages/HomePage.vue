<script setup lang="ts">
  import { NLayout, NLayoutSider, NLayoutContent, NSpace } from 'naive-ui'
  import Editor from '../components/Editor/index.vue'
  import WidgetList from '../components/WidgetList.vue'
  import StylesPanel from '../components/panel/StylesPanel.vue'
  import Calibration from '../components/Editor/Calibration.vue'
</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider size="large">
      <n-layout-sider bordered content-style="padding: 24px;">
        <WidgetList />
      </n-layout-sider>
      <n-layout has-sider sider-placement="right">
        <n-layout-content
          content-style="padding: 24px;"
          class="bg-gray-200 h-screen"
        >
          <Calibration direction="up"></Calibration>
          <Calibration direction="left"></Calibration>
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
          <StylesPanel />
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
