<script setup lang="ts">
  import {
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NSpace,
    NLayoutHeader,
    NMessageProvider,
  } from 'naive-ui'
  import Editor from '../components/Editor/index.vue'
  import WidgetList from '../components/WidgetList.vue'
  import StylesPanel from '../components/panel/StylesPanel.vue'
  import Calibration from '../components/Editor/Calibration.vue'
  import Header from '../components/Header.vue'
</script>

<template>
  <n-message-provider>
    <n-space vertical size="large">
      <n-layout-header style="height: 60px" bordered>
        <Header></Header>
      </n-layout-header>
      <n-layout has-sider size="">
        <n-layout-sider bordered>
          <WidgetList />
        </n-layout-sider>
        <n-layout has-sider sider-placement="right" style="height: 95vh">
          <n-layout-content content-style="padding: 24px;" class="bg-gray-200">
            <Editor />
          </n-layout-content>
          <n-layout-sider
            collapse-mode="width"
            :collapsed-width="0"
            :default-collapsed="false"
            :width="350"
            :native-scrollbar="true"
            show-trigger="arrow-circle"
            content-style="padding-left: 24px;"
            bordered
          >
            <StylesPanel />
          </n-layout-sider>
        </n-layout>
      </n-layout>
    </n-space>
  </n-message-provider>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
  }
</style>
