import { defineStore } from 'pinia'

import { IComponent } from '../types'

export type ComponentState = {
  curComponent: IComponent | null
  components: IComponent[]
}

export const useComponentStore = defineStore('component', {
  state: () =>
    ({
      curComponent: null,
      components: [],
    } as ComponentState),
  actions: {
    setCurComponent(curComponent: IComponent) {
      this.curComponent = curComponent
    },
  },
})
