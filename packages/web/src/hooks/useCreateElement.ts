import { useMainStore } from '../store/main'
import { usePagesStore } from '../store/pages'
import { pageElement } from '../types/elements'
import useHistorySnapshot from './useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const pagesStore = usePagesStore()

  const { addHistorySnapshot } = useHistorySnapshot()

  const createElement = (element: pageElement) => {
    pagesStore.addElement(element)
    mainStore.setActiveElementIds([element.id])

    addHistorySnapshot()
  }

  return {
    createElement,
  }
}
