<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import {
    NModal,
    NButton,
    NForm,
    NFormItem,
    NSelect,
    NInput,
    NInputNumber,
    NColorPicker,
    useMessage,
  } from 'naive-ui'
  import { useStore } from '../../store'
  import { componentEvent } from '../../types'

  const props = defineProps<{
    modalValue: boolean
  }>()

  const emit = defineEmits(['update:modalValue'])

  const store = useStore()

  const onClose = () => {
    emit('update:modalValue', false)
    form = {
      type: 'jump',
      jumpUrl: '',
      modal: {
        title: '',
        width: 300,
        height: 300,
        confirmText: '确定',
        cancelText: '取消',
        confirmColor: '',
        confirmUrl: '',
      },
    }
  }

  let form = reactive<componentEvent>({
    type: 'jump',
    params: {
      jumpUrl: '',
    },
  })

  const typeOptions = ref([
    { label: '跳转链接', value: 'jump' },
    // {
    //   label: '打开弹窗',
    //   value: 'modal',
    // },
    // {
    //   label: '自定义代码',
    //   value: 'code',
    // },
  ])

  const message = useMessage()

  const handleAddEvents = () => {
    const eventData = {
      open: false,
      type: form.type,
      params: { ...form.params },
    }
    const hasEvent = store.curComp?.events.find(
      (event) => event.type === eventData.type
    )
    if (hasEvent) return message.warning('已添加相同动作，不必重复添加')
    store.curComp?.events.push(eventData)
    message.success('添加成功')
    onClose()
  }
</script>

<template>
  <n-modal
    v-model:show="props.modalValue"
    @afterLeave="onClose"
    preset="dialog"
    title=""
    :closable="false"
  >
    <template #header>
      <div>交互设置</div>
    </template>
    <div>
      <n-form label-placement="left" label-width="auto">
        <n-form-item label="交互类型" path="inputValue">
          <n-select
            v-model:value="form.type"
            placeholder="Select"
            :options="typeOptions"
          />
        </n-form-item>
        <template v-if="form.type === 'modal'">
          <n-form-item label="弹窗标题">
            <n-input v-model:value="form.modal.title" placeholder="标题" />
          </n-form-item>
          <n-form-item label="弹窗宽度">
            <n-input-number v-model:value="form.modal.width" />
          </n-form-item>
          <n-form-item label="弹窗高度">
            <n-input-number v-model:value="form.modal.height" />
          </n-form-item>
          <n-form-item label="确认按钮文本">
            <n-input
              v-model:value="form.modal.confirmText"
              placeholder="确定"
            />
          </n-form-item>
          <n-form-item label="确认按钮颜色">
            <n-color-picker
              :modes="['hex']"
              v-model:value="form.modal.confirmColor"
            />
          </n-form-item>
          <n-form-item label="取消按钮文本">
            <n-input v-model:value="form.modal.cancelText" placeholder="取消" />
          </n-form-item>
        </template>
      </n-form>
    </div>
    <template #action>
      <n-button @click="onClose">取消</n-button>
      <n-button type="info" @click="handleAddEvents">确定</n-button>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped></style>
