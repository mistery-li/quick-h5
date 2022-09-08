import { useMainStore } from '../store/main'

export default () => {
  const mainStore = useMainStore()

  // startMove 表示是否需要再选中操作后进入到开始移动的状态
  const selectElement = (e: MouseEvent, element, startMove = true) => {
    // todo 增加组合选中, 同时拖拽组合元素
    mainStore.activeElementIds.push(element.id)
    mainStore.setHandleElementId(element.id)
  }

  return { selectElement }
}
