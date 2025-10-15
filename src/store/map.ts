/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MapState {
  coordinate: [number, number] | null
}

const initialState: MapState = {
  coordinate: null
}

export const MapSlide = createSlice({
  name: 'coordinate',
  initialState,
  reducers: {
    getdataMap: (state, action: PayloadAction<[number, number]>) => {
      state.coordinate = action.payload
    }
  }
})

export const { getdataMap } = MapSlide.actions
export const coordinateSelector = (state: { coordinate: MapState }) => state.coordinate.coordinate

export default MapSlide.reducer
