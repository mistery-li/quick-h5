<script setup lang="ts">
  import { computed, ref, CSSProperties } from 'vue'
  import { NIcon, NButton, NTabs, NTabPane, NImage } from 'naive-ui'
  import { Language, ImageOutline, Layers } from '@vicons/ionicons5'

  import { COMPONENTS, TEXT_COMPONENTS, IMAGE_COMPONENTS } from '../constans'
  import { SOLID_BACKGROUND } from '../constans/Background'
  import { customStyle } from '../types'
  import { useStore } from '../store'

  const props = defineProps<{
    modelValue: boolean
  }>()

  console.log(props, 'props')

  const emit = defineEmits(['update:modelValue'])

  const store = useStore()

  const handleDragStart = (event: DragEvent) => {
    const start = {
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    }
    event.dataTransfer?.setData(
      'element',
      JSON.stringify(
        components.value[Number((event.target as HTMLElement).dataset.index!)]
      )
    )
    // 记录鼠标拖拽开始偏移量
    event.dataTransfer?.setData('start', JSON.stringify(start))
  }

  const menus = ref([
    {
      name: '文字',
      type: 'text',
      icon: Language,
    },
    {
      name: '图片',
      type: 'image',
      icon: ImageOutline,
    },
    {
      name: '背景',
      type: 'background',
      icon: Layers,
    },
  ])
  const current = ref('text')
  const onSelectMenu = (menuType: string) => {
    current.value = menuType
    emit('update:modelValue', false)
  }

  const components = computed(() => {
    if (current.value === 'text') return TEXT_COMPONENTS
    if (current.value === 'image') return IMAGE_COMPONENTS
    return COMPONENTS
  })

  const getCustomStyle = (_style: customStyle | undefined): CSSProperties => {
    if (!_style) return {}
    if (current.value === 'text') {
      return {
        height: _style.height + 'px',
        fontSize: (_style.fontSize as number) / 2 + 'px',
        lineHeight: 2,
        textAlign: _style.textAlign,
      }
    }
    return {}
  }

  const onSelectBackground = (color: string) => {
    store.setPageStyle({ background: color })
  }
</script>

<template>
  <div class="left-menu-wrap">
    <div class="menus">
      <div
        class="menu"
        :class="menu.type === current ? 'active' : ''"
        :key="index"
        @click="onSelectMenu(menu.type)"
        v-for="(menu, index) in menus"
      >
        <n-icon size="32">
          <component :is="menu.icon"></component>
        </n-icon>
        <div>{{ menu.name }}</div>
      </div>
    </div>
    <template v-if="current === 'background'">
      <div class="pl-1">
        <div class="background-widget w-full h-screen bg-slate-100">
          <div class="solid-color">
            <div>纯色</div>
            <div class="solid-color-list flex flex-wrap">
              <span
                @click="onSelectBackground(color)"
                class="solid-item w-8 h-8 m-1"
                :key="color"
                v-for="color in SOLID_BACKGROUND"
                :style="{ background: color }"
              ></span>
            </div>
          </div>
          <div class="w-full text-center">
            <n-button type="primary" style="width: 96%" size="large"
              >上传背景色</n-button
            >
          </div>
          <n-tabs type="line" animated>
            <n-tab-pane name="texture" tab="纹理">
              <div class="flex flex-wrap">
                <div class="texture-item m-2" v-for="item in 10"></div>
              </div>
            </n-tab-pane>
            <n-tab-pane name="my" tab="我的">
              暂不支持登录态上传个人背景图片,计划开放中
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="widget-list w-full h-screen bg-slate-50"
        @dragstart="handleDragStart"
      >
        <div
          v-for="(item, index) in components"
          :key="index"
          class="draggable"
          :class="item.component !== 'VText' ? 'image-widget' : 'text-widget'"
          :style="getCustomStyle(item.style)"
          draggable="true"
          :data-index="index"
        >
          <img
            :data-index="index"
            v-if="item.component === 'Picture'"
            :src="item.propValue"
          />
          <div v-else>{{ item.label }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  img {
    width: 100%;
    height: 100%;
  }
  .left-menu-wrap {
    display: flex;
    .menus {
      flex-shrink: 0;
      width: 80px;
      text-align: center;
      @mixin menu-common-style {
        background: #0ecac1;
        color: #fff;
      }
      .menu:hover {
        @include menu-common-style;
        cursor: pointer;
      }
      .active {
        @include menu-common-style;
      }
    }
    .solid-item {
      border: 1px solid #0ecac1;
      cursor: pointer;
    }
    .widget-list {
      padding-left: 10px;
      .draggable {
        cursor: pointer;
      }
      .image-widget {
        width: 100px;
        height: 120px;
        border: 1px solid #0ecac1;
      }
      .text-widget {
        display: inline-block;
        width: 90%;
        background: #fff;
        margin: 10px auto;
      }
    }
    .texture-item {
      width: 50px;
      height: 80px;
      border: 1px solid #0ecac1;
    }
  }
</style>
