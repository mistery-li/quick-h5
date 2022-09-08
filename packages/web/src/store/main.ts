import { defineStore } from 'pinia'
import { usePagesStore } from './pages'

export const useMainStore = defineStore('main', {
  state: () => ({
    activeElementIds: [],
    handleElementId: '',
    gridLineSize: 0, // 不显示网格
  }),
  getters: {
    handleElement(state) {
      const pagesStore = usePagesStore()
      const currentPage = pagesStore.currentPage
      if (!currentPage || !currentPage.elements) return null
      return (
        currentPage.elements.find(
          (element) => element.id === state.handleElementId
        ) || null
      )
    },
  },
  actions: {
    setActiveElementIds(ids) {
      this.activeElementIds = ids
    },
    setHandleElementId(id) {
      this.handleElementId = id
    },
  },
})
