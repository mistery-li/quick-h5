<script setup lang="ts">
  import { ref, onBeforeMount, watch, reactive } from 'vue'
  import type { Component } from 'vue'
  import { NModal, NForm, NFormItem, NInput, NButton } from 'naive-ui'

  import VButton from './Widget/VButton.vue'
  import VText from './Widget/VText.vue'
  import Picture from './Widget/Picture.vue'

  import { getStyle } from '../utils/utils'
  import { customStyle, IComponent } from '../types'

  type eventMap = {}

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
    emit('update:modelValue', false)
  }

  const webForm = reactive({
    title: '',
    description: '',
  })

  const components: (IComponent & {
    eventMap: { [name: string]: () => void }
  })[] = JSON.parse(localStorage.getItem('previewData') || '') || []

  const comps = components.map((comp) => {
    const events = comp.events.filter((event) => !!event.open)
    const eventMap: { [name: string]: () => void } = {}
    events.forEach((event) => {
      eventMap['onclick'] = function () {
        window.location.href = event.params.jumpUrl || ''
      }
    })
    comp.eventMap = eventMap
    return comp
  })

  const getComponentStyle = (style: customStyle) => {
    const styles = getStyle(style)
    return styles
  }

  const componentMap: { [key: string]: Component } = {
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
          <template v-for="(item, index) in comps" :key="item.uuid">
            <component
              v-bind="{ ...item.eventMap }"
              :is="componentMap[item.component]"
              class="component"
              :element="item"
              :style="{ ...getComponentStyle(item.style), zIndex: index }"
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
  .component {
    position: absolute;
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
