import { defineStore } from 'pinia'
import { CSSProperties } from 'vue'

import { IComponent, StyleMap } from '../types'
import { swap } from '../utils/utils'
type undoRedo =
  | {
      type: 'add'
      value: IComponent
    }
  | {
      type: 'update'
      value: IComponent[]
    }

export const useStore = defineStore('editor', {
  state: () => {
    return {
      comps: [] as IComponent[],
      curComp: null as IComponent | null,
      history: [] as undoRedo[],
      current: -1,
      canvas: {
        styles: {
          width: 375,
          height: 600,
        },
      },
    }
  },
  actions: {
    addComp(comp: IComponent) {
      this.comps.push(comp)
      this.curComp = comp
      this.addHistory({
        type: 'add',
        value: comp,
      })
    },
    clearCanvas() {
      this.comps = []
      this.curComp = null
      this.history = []
      this.current = -1
    },
    updateComps() {
      const comps = [...this.comps]
      for (let index = 0; index < comps.length; index++) {
        if (comps[index].uuid === this.curComp!.uuid) {
          comps[index] = {
            ...this.curComp,
            style: {
              ...this.curComp?.style,
            },
          }
          break
        }
      }
      this.comps = comps
    },
    setSelectComp(data: null | IComponent) {
      this.curComp = data
      this.updateComps()
    },
    deleteCurComp() {
      this.comps = this.comps.filter((comp) => comp.uuid !== this.curComp.uuid)
      this.curComp = null
    },
    setCurCompToTop() {
      const index = this.comps.findIndex(
        (comp) => comp.uuid === this.curComp.uuid
      )
      this.comps.splice(index, 1)
      this.comps.push(this.curComp)
    },
    setCurCompToUp() {
      const index = this.comps.findIndex(
        (comp) => comp.uuid === this.curComp.uuid
      )
      console.log(index, 'index')
      swap(this.comps, index, index + 1)
    },
    setCurCompToDown() {
      const index = this.comps.findIndex(
        (comp) => comp.uuid === this.curComp.uuid
      )
      console.log(index, 'index')
      swap(this.comps, index, index - 1)
    },
    setCurCompToBottom() {
      const index = this.comps.findIndex(
        (comp) => comp.uuid === this.curComp.uuid
      )
      this.comps.splice(index, 1)
      this.comps.unshift(this.curComp)
    },
    updateSelectedCompStyle(_style: StyleMap) {
      this.curComp!.style = { ..._style }
      this.updateComps()
    },
    updateSelectedCompDataAnyStyles(data: any, _styles: StyleMap) {
      this.curComp = {
        ...this.curComp,
        ...data,
        style: {
          ...this.curComp?.style,
          ..._styles,
        },
      }
      this.updateComps()
    },
    updateCanvasStyles<
      T extends { [key in keyof CSSProperties]: string | number }
    >(_style: T) {
      this.canvas.styles = { ...this.canvas.styles, ..._style }
    },
    undo() {
      const index = this.current - 1 < 0 ? -1 : this.current - 1
      if (index !== this.current) {
        const item = this.history[this.current]
        this.current = index
        if (item?.type === 'add') {
          this.comps.pop()
          if (item.value.uuid === this.curComp?.uuid) {
            this.curComp = null
          }
        } else {
          this.curComp = item?.value[0]
          this.updateComps()
        }
      }
    },
    redo() {
      const index =
        this.current + 1 < this.history.length
          ? this.current + 1
          : this.history.length - 1
      if (index !== this.current) {
        const item = this.history[index]
        if (item.type === 'add') {
          this.comps.push(item.value)
          this.curComp = item.value
        } else {
          this.curComp = item.value[1]
          this.updateComps()
        }
        this.current = index
      }
    },

    addHistory(data: undoRedo) {
      this.history.push(data)
      this.current++
    },
  },
})
