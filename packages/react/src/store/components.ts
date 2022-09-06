import { ConsoleSqlOutlined } from '@ant-design/icons'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CSSProperties } from 'react'
import { ComponentItem, Nullable, Pos } from '../types'
import { RootState } from './index'

interface IState {
  comps: ComponentItem[]
  curComp: Nullable<ComponentItem>
  editorConfig: any
  history: any[]
  current: number
}

const initialState: IState = {
  comps: [],
  curComp: null,
  editorConfig: {
    showGrid: false,
    fit: 'fullScreen',
  },
  history: [],
  current: -1,
}

export const componentsSlice = createSlice({
  name: 'editor',
  initialState: initialState,
  reducers: {
    addComp(state, action: PayloadAction<ComponentItem>) {
      const { comps } = state
      comps.push(action.payload)
    },
    updateComps(state) {
      const { comps, curComp } = state
      if (curComp) {
        const idx = comps.findIndex((comp) => comp.uuid === curComp.uuid)
        comps.splice(idx, 1, curComp)
      }
    },
    setCurComp(state, action: PayloadAction<ComponentItem>) {
      state.curComp = action.payload
    },
    setLockComp(state) {
      if (state.curComp) {
        state.curComp.lock = !state.curComp.lock
      }
    },
    deleteCurComp(state) {
      const idx = state.comps.findIndex(
        (comp) => comp.uuid === state.curComp?.uuid
      )
      state.comps.splice(idx, 1)
      state.curComp = null
    },
    setCurCompPos(state, action: PayloadAction<Pos>) {
      if (state.curComp) {
        state.curComp.pos = action.payload
      }
    },
    setCurCompStyle(state, action: PayloadAction<CSSProperties>) {
      if (state.curComp) {
        state.curComp = {
          ...state.curComp,
          style: {
            ...state.curComp.style,
            ...action.payload,
          },
        }
      }
    },
    compToTop(state) {
      const index = state.comps.findIndex(
        (comp) => comp.uuid === state.curComp?.uuid
      )
      console.log(index, 'index')
      state.comps.push(state.comps.splice(index, 1)[0])
      console.log(state.comps, 'state comps')
    },
    compToBottom(state) {
      const index = state.comps.findIndex(
        (comp) => comp.uuid === state.curComp?.uuid
      )
      // 删除当前数组元素，并将被删除的值添加到数组末尾
      state.comps.unshift(state.comps.splice(index, 1)[0])
    },
    compToUp(state) {
      const index = state.comps.findIndex(
        (comp) => comp.uuid === state.curComp?.uuid
      )
      console.log([index, state.comps.length], 'index')
      if (index !== state.comps.length - 1) {
        state.comps[index] = state.comps.splice(
          index + 1,
          1,
          state.comps[index]
        )[0]
      }
      console.log(state.comps, 'update comps')
    },
    compToDown(state) {
      const index = state.comps.findIndex(
        (comp) => comp.uuid === state.curComp?.uuid
      )
      if (index !== 0) {
        state.comps[index - 1] = state.comps.splice(
          index,
          1,
          state.comps[index - 1]
        )[0]
      }
    },
    updateEditorConfig(state, action: PayloadAction<any>) {
      state.editorConfig = {
        ...state.editorConfig,
        ...action.payload,
      }
    },
    undo(state) {
      const current = state.current
      const index = current - 1 < 0 ? -1 : current - 1
      if (index !== current) {
        const item = state.history[current]
        state.current = index
        if (item?.type === 'add') {
          state.comps.pop()
          if (item.value.uuid === state.curComp?.uuid) {
            state.curComp = null
          }
        } else {
          state.curComp = item?.value[0]
          updateComps()
        }
      }
    },
    redo(state) {
      const current = state.current
      const index =
        current + 1 < state.history.length
          ? current + 1
          : state.history.length - 1
      if (index !== current) {
        const item = state.history[index]
        if (item.type === 'add') {
          state.comps.push(item.value)
          state.curComp = item.value
        } else {
          state.curComp = item.value[1]
          updateComps()
        }
        state.current = index
      }
    },

    addHistory(state, action) {
      state.history.push(action.payload)
      state.current++
    },
  },
})

export const getComps = (state: RootState) => state.editor.comps

export const getCurComp = (state: RootState) => state.editor.curComp

export const getEditorConfig = (state: RootState) => state.editor.editorConfig

export const getHistory = (state: RootState) => state.editor.history

export const getCurrent = (state: RootState) => state.editor.current

export const getMoveDirection = (state: RootState) =>
  state.componentsData.moveDirection

export const {
  addComp,
  setCurComp,
  setCurCompPos,
  updateComps,
  setCurCompStyle,
  updateEditorConfig,
  addHistory,
  undo,
  redo,
  deleteCurComp,
  setLockComp,
  compToTop,
  compToBottom,
  compToUp,
  compToDown,
  // filterComponentsByIndex,
  // setCurComponent,
  // setShapeStyle,
  // setMoveDirection,
  // setCurComponentStyle,
  // setComponents,
  // setCurComponentPos,
} = componentsSlice.actions

export default componentsSlice.reducer
