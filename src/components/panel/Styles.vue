<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    NTag,
    NH2,
    NResult,
    NForm,
    NUpload,
    NFormItem,
    NInputNumber,
    NSelect,
    NColorPicker,
  } from 'naive-ui'

  import { useComponentStore } from '../../store/component'
  import { stylesMap } from '../../config/styles'

  const componentStore = useComponentStore()
  const { curComponent } = storeToRefs(componentStore)

  const styleKeys = computed(
    () =>
      curComponent.value &&
      (
        Object.keys(curComponent.value.style) as Array<
          keyof typeof curComponent.value.style
        >
      ).filter(
        (key) => !['transform', 'width', 'height', 'left', 'top'].includes(key)
      )
  )
</script>

<template>
  <div v-if="!curComponent">
    <n-result
      status="404"
      title="还没有数据呢"
      description="拖拽部件生成你的营销H5页面吧"
      size="medium"
    >
    </n-result>
  </div>
  <div v-else>
    <div class="flex justify-center">
      <n-h2>属性设置</n-h2>
      <n-tag class="ml-2" type="info"> {{ curComponent.label }}组件 </n-tag>
    </div>
    {{ JSON.stringify(curComponent, null, 2) }}
    <n-form
      :model="curComponent"
      label-placement="left"
      size="medium"
      :label-width="80"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="上传图片" path="propValue">
        <n-upload
          :max="1"
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          :default-file-list="[
            {
              id: 'c',
              name: '默认图片',
              status: 'finished',
              url: curComponent?.propValue,
            },
          ]"
          list-type="image-card"
        >
          点击上传
        </n-upload>
      </n-form-item>
      <!-- <n-form-item label="圆角" path="style.borderRadius">
        <n-input-number
          v-model:value="curComponent.style.borderRadius"
        ></n-input-number>
      </n-form-item> -->
      <template v-for="styleKey in styleKeys" :key="styleKey">
        <n-form-item :label="stylesMap[(styleKey as any)]">
          <n-select
            v-if="styleKey === 'textAlign'"
            v-model:value="curComponent.style.textAlign"
            placeholder="Select"
            :options="[
              { label: '左边', value: 'left' },
              { label: '中间', value: 'center' },
              { label: '右边', value: 'right' },
            ]"
          />
          <n-color-picker
            v-else-if="styleKey.includes('color')"
            v-model:value="curComponent.style[styleKey]"
          >
          </n-color-picker>
          <n-input-number
            v-else
            v-model:value="curComponent.style[styleKey]"
          ></n-input-number>
        </n-form-item>
      </template>
    </n-form>
  </div>
</template>

<style lang="scss" scoped></style>
