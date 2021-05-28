import { createSlice } from '@reduxjs/toolkit';
import { Shape } from 'interface';

export const name = 'polygon';
const initialState: Array<Shape> = [];
const { actions, reducer } = createSlice({
  name,
  initialState,
  reducers: {
    addShape: (state, action: { payload: Shape }) => {
      const { payload } = action;
      return [...state, payload];
    },
    deleteShape: (state, action: { payload: string }) => {
      const { payload } = action;
      return state.filter((shape) => shape.id !== payload);
    },
  },
});

export const { addShape } = actions;
export default reducer;
