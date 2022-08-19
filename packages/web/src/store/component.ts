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
    setComponentData(data: IComponent) {
      if (data) {
        const index = this.components.findIndex(
          (item) => item.uuid === data.uuid
        )

        this.components.splice(index, 1, data)
      }
    },
  },
})
