// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import MapSlide from './map'
import TabBranchSlide from './tabbranch'

export const store = configureStore({
  reducer: {
    map: MapSlide,
    tabBranch: TabBranchSlide
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
