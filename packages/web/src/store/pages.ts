import { defineStore } from 'pinia'
import { useMainStore } from './main'

export const usePagesStore = defineStore('pages', {
  state: () => ({
    pages: [
      {
        id: 'quick-page-1',
        elements: [],
        background: '',
      },
    ], // 页面集
    pageIndex: 0, // 页面索引
  }),
  getters: {
    currentPage(state) {
      return state.pages[state.pageIndex]
    },
  },
  actions: {
    addPages(page) {
      this.pages.push(page)
    },
    setPages(pages) {
      this.pages = pages
    },
    updatePagesIndex(index) {
      this.pageIndex = index
    },
    addElement(element) {
      const elements = Array.isArray(element) ? element : [element]
      console.log([this.pages, this.pageIndex], 222)
      const currentPageEls = this.pages[this.pageIndex].elements
      const newEls = [...currentPageEls, ...elements]
      this.pages[this.pageIndex].elements = newEls
    },
    updateElementStyle(style) {
      const mainStore = useMainStore()
      const currentPageEls = this.pages[this.pageIndex].elements
      const handleElementId = mainStore.handleElementId
      const index = currentPageEls.findIndex(
        (ele) => ele.id === handleElementId
      )
      const _style = this.pages[this.pageIndex].elements[index].style
      this.pages[this.pageIndex].elements[index].style = { ..._style, ...style }
      console.log(this.pages, 'pages')
    },
  },
})
