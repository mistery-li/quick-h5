import { configureStore } from '@reduxjs/toolkit'
import componentsReducer from './components'

const store = configureStore({
  reducer: {
    editor: componentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
