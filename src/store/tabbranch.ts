/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TabBranch {
  hasBranch: boolean
}

const initialState: TabBranch = {
  hasBranch: false
}

export const TabBranchSlide = createSlice({
  name: 'hasBranch',
  initialState,
  reducers: {
    getBranchTab: (state, action: PayloadAction<boolean>) => {
      state.hasBranch = action.payload
    }
  }
})

export const { getBranchTab } = TabBranchSlide.actions
export const hasBranchSelector = (state: { hasBranch: TabBranch }) => state.hasBranch.hasBranch

export default TabBranchSlide.reducer
