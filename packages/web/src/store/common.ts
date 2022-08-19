import { defineStore } from 'pinia'
import { IComponent } from '../types'

export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      editorStyles: {
        width: '375px',
        height: '800px',
      },
      editorRect: document.getElementById('editor')?.getBoundingClientRect(),
      isEdit: true,
      isMoveStart: false,
      isMove: false,
      history: [] as any,
      counter: -1,
    }
  },
  actions: {},
})
