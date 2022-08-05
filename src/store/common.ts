import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      editorStyles: {
        width: '375px',
        height: '800px',
      },
      editorRect: document.getElementById('editor')?.getBoundingClientRect(),
    }
  },
})
