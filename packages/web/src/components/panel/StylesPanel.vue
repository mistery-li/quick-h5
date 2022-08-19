<script setup lang="ts">
  import { ref, watch } from 'vue'
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
  import { StyleMap } from '../../types'

  const store = useStore()

  const styleKeys = ref<StyleMap[]>([])

  watch(
    () => store.curComp,
    (val) => {
      // @ts-ignore
      styleKeys.value = Object.keys(val?.style).filter(
        (key) => !['transform', 'width', 'height', 'left', 'top'].includes(key)
      )
      store.updateComps()
    },
    {
      deep: true,
    }
  )

  const showEvents = ref(false)
  const addEvents = () => {
    showEvents.value = true
  }
</script>

<template>
  <div v-if="!store.curComp">
    <n-result
      status="404"
      title="还没有数据呢"
      description="拖拽部件生成你的营销H5页面吧"
      size="medium"
    >
    </n-result>
  </div>
  <div v-else>
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="属性">
        <div class="flex">
          <n-h2>属性设置</n-h2>
          <n-tag class="ml-2" type="info">
            {{ store.curComp.label }}组件
          </n-tag>
        </div>
        <n-form
          :model="store.curComp"
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
                v-model:value="store.curComp.style[styleKey]"
              >
              </n-color-picker>
              <n-input-number
                v-else
                v-model:value="store.curComp.style[styleKey]"
              ></n-input-number>
            </n-form-item>
          </template>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="the beatles" tab="动作">
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
              <td>{{ item.data.type === 'jump' ? '跳转链接' : '打开弹窗' }}</td>
            </tr>
          </tbody>
        </n-table>

        <n-collapse style="margin-top: 30px">
          <n-collapse-item
            :title="`事件${index + 1}`"
            name="1"
            v-for="(item, index) in store.curComp.events"
          >
            <template v-if="item.data.type === 'jump'">
              <div class="tips bg-slate-200 p-2 mb-2">
                举例：当点击时跳转到百度(https://www.baidu.com)
              </div>
              <n-input
                placeholder="跳转地址"
                v-model:value="item.data.jumpUrl"
              ></n-input>
            </template>
          </n-collapse-item>
        </n-collapse>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="动画">动作</n-tab-pane>
    </n-tabs>
  </div>
  <event-modal v-model:modalValue="showEvents"></event-modal>
</template>

<style lang="scss" scoped></style>
