import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { usePagesStore } from '../store/pages'
import useHistorySnapshot from './useHistorySnapshot'

export default () => {
  const pagesStore = usePagesStore()

  const { currentPage } = storeToRefs(pagesStore)
  const { addHistorySnapshot } = useHistorySnapshot()
  const createPage = () => {
    const emptyPage = {
      id: 'adasdasd',
      elements: [],
      background: '',
    }

    pagesStore.addPages(emptyPage)
    addHistorySnapshot()
  }

  const createPageByTemplate = (page) => {
    const elements = cloneDeep(page.elements)
    const page = {
      id: '11adad',
      elements,
      background: '',
    }
    pagesStore.addPages(page)
    addHistorySnapshot()
  }

  const copyAndPastePage = () => {
    const page = cloneDeep(currentPage)
    pagesStore.addPages(page)
  }

  const deleteCurrentPage = (targetPage = currentPage.value) => {
    pagesStore.currentPage = pagesStore.pages[pagesStore.pageIndex + 1]
    pagesStore.updatePagesIndex(pagesStore.pageIndex + 1)
    addHistorySnapshot()
  }

  return {
    createPage,
    createPageByTemplate,
    copyAndPastePage,
    deleteCurrentPage,
  }
}
