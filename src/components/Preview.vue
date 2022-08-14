<script setup lang="ts">
  import { ref, onBeforeMount, watch, reactive } from 'vue'
  import type { CSSProperties } from 'vue'
  import { NModal, NForm, NFormItem, NInput, NButton } from 'naive-ui'

  import VButton from './Widget/VButton.vue'
  import VText from './Widget/VText.vue'
  import Picture from './Widget/Picture.vue'

  import { getStyle } from '../utils/utils'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
  }>()

  const showModal = ref(false)
  onBeforeMount(() => {
    showModal.value = props.modelValue
  })
  watch(
    () => props.modelValue,
    (val) => {
      showModal.value = val
    }
  )

  const onClose = () => {
    console.log(111)
    emit('update:modelValue', false)
  }

  const webForm = reactive({
    title: '',
    description: '',
  })

  const components = JSON.parse(localStorage.getItem('previewData'))
  console.log(components, 'component parse')

  const getComponentStyle = (style: CSSProperties) => {
    const styles = getStyle(style, ['top', 'left', 'transform'])
    return styles
  }

  const componentMap = {
    VButton,
    VText,
    Picture,
  }
</script>

<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    size="huge"
    :style="{ width: '800px' }"
    @after-leave="onClose"
    :show-icon="false"
  >
    <div class="flex justify-between" style="height: 800px">
      <div class="preview-container flex-shrink-0">
        <div class="mobile">
          <!-- 直接渲染页面效果，保存依然 -->
          <!-- 发布的时候构建真实页面 -->
          <template v-for="(item, index) in components" :key="item.uuid">
            <component
              :is="componentMap[item.component]"
              class="component"
              :element="item"
              :style="getComponentStyle(item.style)"
            ></component>
          </template>
        </div>
      </div>
      <div>
        <n-form
          ref="formRef"
          :model="webForm"
          :label-width="80"
          label-placement="top"
          size="medium"
          :style="{
            maxWidth: '640px',
          }"
        >
          <n-form-item label="标题" path="title">
            <n-input v-model:value="webForm.title" placeholder="标题" />
          </n-form-item>
          <n-form-item label="描述" path="description">
            <n-input
              v-model:value="webForm.description"
              placeholder="Textarea"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5,
              }"
            />
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button round> 保存 </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
  .component-wrap {
    display: inline-block;
  }
  .preview-container {
    position: relative;
    left: 10px;
    top: 50%;
    margin-top: -375px;
    width: 520px;
    height: 750px;
    box-sizing: content-box;
  }

  .mobile {
    position: absolute;
    left: 40px;
    min-width: 376px;
    height: 650px;
    display: inline-block;
    background: #fff;
    box-sizing: content-box;
    border-top: 40px solid #000;
    border-left: 10px solid #000;
    border-right: 10px solid #000;
    border-bottom: 60px solid #000;
    border-radius: 20px;
    transform-origin: 100% 0;
    transform: scale(1);
    overflow-y: auto;
    &::before {
      content: '';
      position: absolute;
      width: 342px;
      height: 569px;
      border-radius: 50px;
      top: 15px;
      left: 9px;
      z-index: -1;
    }
  }
</style>
