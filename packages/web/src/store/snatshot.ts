import { defineStore } from 'pinia'
import { useMainStore } from './main'

import { usePagesStore } from './pages'

const MAX_SNAPSHOT_LENGTH = 250

export const useSnapshotStore = defineStore('snapshot', {
  state: () => ({
    snapshotData: [],
    snapshotCursor: -1, // 快照指针
    snapshotLength: 0, // 快照长度
  }),
  getters: {
    canUndo(state) {
      return state.snapshotCursor > 0
    },
    canRedo(state) {
      return state.snapshotCursor < state.snapshotLength - 1
    },
  },
  actions: {
    setSnapshotCursor(cursor: number) {
      this.snapshotCursor = cursor
    },
    setSnapshotLength(length: number) {
      this.snapshotLength = length
    },

    addSnapshot() {
      const pageStore = usePagesStore()
      if (
        this.snapshotCursor >= 0 &&
        this.snapshotCursor < this.snapshotData.length - 1
      ) {
        // 覆盖该段snapshot后面数据
        this.snapshotData.splice(this.snapshotCursor + 1)
      }

      const snapshot = {
        index: pageStore.pageIndex,
        pages: pageStore.pages,
      }

      let newSnapshotLength = this.snapshotData.length

      if (newSnapshotLength > MAX_SNAPSHOT_LENGTH) {
        this.snapshotData.unshift()
        newSnapshotLength--
      }

      this.snapshotData.push(snapshot)

      this.setSnapshotCursor(newSnapshotLength - 1)
      this.setSnapshotLength(newSnapshotLength)
    },
    unDo() {
      if (this.snapshotCursor <= 0) return
      const pageStore = usePagesStore()
      const mainStore = useMainStore()
      const snapshotCursor = this.snapshotCursor - 1
      const snapshotData = this.snapshotData
      const { index, pages } = snapshotData[snapshotCursor]
      const pageIndex = index > pages.length - 1 ? pages.length - 1 : index

      pageStore.setPages(pages)
      pageStore.updatePagesIndex(pageIndex)
      this.setSnapshotCursor(snapshotCursor)
      mainStore.setActiveElementIds([])
    },

    reDo() {
      if (this.snapshotCursor > this.snapshotLength - 1) return
      const pagesStore = usePagesStore()
      const mainStore = useMainStore()

      const snapshotCursor = this.snapshotCursor + 1
      const { index, pages } = this.snapshotData[snapshotCursor]
      const pagesIndex = index > pages.length - 1 ? pages.length - 1 : index

      pagesStore.setPages(pages)
      pagesStore.updatePagesIndex(pagesIndex)
      this.setSnapshotCursor(snapshotCursor)
      mainStore.setActiveElementIds([])
    },
  },
})
