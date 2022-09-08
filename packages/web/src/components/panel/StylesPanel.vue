<script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    NTag,
    NH2,
    NResult,
    NForm,
    NUpload,
    NFormItem,
    NInputNumber,
    NInput,
    NSelect,
    NColorPicker,
    NButton,
    NTabs,
    NTabPane,
    NTable,
    NSwitch,
    NCollapse,
    NCollapseItem,
  } from 'naive-ui'

  import { stylesMap } from '../../config/styles'
  import { useStore } from '../../store'
  import EventModal from './EventModal.vue'
  import { customStyle } from '../../types'
  import { EVENT_MAP } from '../../constans'
  import { storeToRefs } from 'pinia'
  import { usePagesStore } from '../../store/pages'
  import { useMainStore } from '../../store/main'

  const { currentPage } = storeToRefs(usePagesStore())

  const mainStore = useMainStore()
  const { handleElement } = storeToRefs(mainStore)

  const styleKeys = ref<(keyof customStyle)[]>([])

  const elementTabs = computed(() => {
    if (!handleElement.value) return []
    console.log(handleElement.value, 'handle element')
    if (handleElement.value.component === 'VText') {
      return [
        {
          label: '文字',
          name: 'text',
        },
        {
          label: '动画',
          name: 'animation',
        },
      ]
    } else {
      return []
    }
  })

  const showEvents = ref(false)
  const addEvents = () => {
    showEvents.value = true
  }
</script>

<template>
  <div v-if="elementTabs.length === 0">
    <n-result
      status="404"
      title="暂无正在操作的元素"
      description="请拖拽元素到画布中进行编辑"
      size="medium"
    >
    </n-result>
  </div>
  <div v-else>
    <n-tabs type="line" animated>
      <n-tab-pane :name="tab.name" :tab="tab.label" v-for="tab in elementTabs">
        <div class="flex">
          <n-h2>属性设置</n-h2>
          <n-tag class="ml-2" type="info">
            {{ handleElement.label }}组件
          </n-tag>
        </div>
        <n-form
          :model="handleElement"
          label-placement="left"
          size="medium"
          :label-width="80"
          :style="{
            maxWidth: '640px',
          }"
        >
          <n-form-item
            v-if="store.curComp.component !== 'Picture'"
            label="输入文案"
            patch="propValue"
          >
            <n-input v-model:value="store.curComp.propValue"></n-input>
          </n-form-item>
          <n-form-item
            label="上传图片"
            path="propValue"
            v-if="store.curComp.component === 'Picture'"
          >
            <n-upload
              :max="1"
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              :default-file-list="[
                {
                  id: 'c',
                  name: '默认图片',
                  status: 'finished',
                  url: store.curComp?.propValue,
                },
              ]"
              list-type="image-card"
            >
              点击上传
            </n-upload>
          </n-form-item>
          <template v-for="styleKey in styleKeys" :key="styleKey">
            <n-form-item :label="stylesMap[(styleKey as any)]">
              <n-select
                v-if="styleKey === 'textAlign'"
                v-model:value="store.curComp.style.textAlign"
                placeholder="Select"
                :options="[
                  { label: '左边', value: 'left' },
                  { label: '中间', value: 'center' },
                  { label: '右边', value: 'right' },
                ]"
              />
              <n-color-picker
                :modes="['hex']"
                v-else-if="
                  styleKey.includes('color') || styleKey.includes('Color')
                "
                v-model:value="(store.curComp.style[styleKey] as string)"
              >
              </n-color-picker>
              <n-input-number
                v-else
                :step="styleKey === 'fontWeight' ? 100 : 1"
                v-model:value="(store.curComp.style[styleKey] as number)"
                :placeholder="styleKey"
              ></n-input-number>
            </n-form-item>
          </template>
        </n-form>
      </n-tab-pane>
      <!-- <n-tab-pane name="the beatles" tab="动作">
        <n-button type="primary" @click="addEvents">添加动作</n-button>
        <n-table :single-line="false" style="margin-top: 30px">
          <thead>
            <tr>
              <th>id</th>
              <th>是否开启</th>
              <th>动作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in store.curComp.events">
              <td>{{ index + 1 }}</td>
              <td><n-switch v-model:value="item.open"></n-switch></td>
              <td>{{ item.type === 'jump' ? '跳转链接' : '打开弹窗' }}</td>
            </tr>
          </tbody>
        </n-table>

        <n-collapse style="margin-top: 30px">
          <n-collapse-item
            :title="`${EVENT_MAP[item.type]}`"
            name="1"
            v-for="(item, index) in store.curComp.events"
          >
            <template v-if="item.type === 'jump'">
              <div class="tips bg-slate-200 p-2 mb-2">
                举例：当点击时跳转到百度(https://www.baidu.com)
              </div>
              <n-input
                placeholder="跳转地址"
                v-model:value="item.params.jumpUrl"
              ></n-input>
            </template>
          </n-collapse-item>
        </n-collapse>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="动画">动作</n-tab-pane> -->
    </n-tabs>
  </div>
  <event-modal v-model:modalValue="showEvents"></event-modal>
</template>

<style lang="scss" scoped></style>
