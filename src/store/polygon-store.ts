import { createSlice } from '@reduxjs/toolkit';
import { ShapeStore } from 'interface';

export const name = 'polygon';
// 완성된 polygon이 저장됨.
const initialState: Array<ShapeStore> = [];
const { actions, reducer } = createSlice({
  name,
  initialState,
  reducers: {
    addShape: (state, action: { payload: ShapeStore }) => {
      const { payload } = action;
      return [...state, payload];
    },
    deleteShape: (state, action: { payload: string }) => {
      const { payload } = action;
      return state.filter((shape) => shape.id !== payload);
    },
    setOver: (state, action: { payload: string | undefined }) => {
      const { payload } = action;
      return state.reduce(
        (arr: Array<ShapeStore>, { id, points }) => [...arr, { id, points, isOver: payload === id }],
        [],
      );
    },
  },
});

export const { addShape, setOver, deleteShape } = actions;
export default reducer;
