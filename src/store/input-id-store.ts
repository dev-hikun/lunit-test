import { createSlice } from '@reduxjs/toolkit';

export interface InputIdStatus {
  id: number;
}

const initialState: InputIdStatus = {
  id: 0,
};

export const name = 'inputId';
const { reducer, actions } = createSlice({
  name,
  initialState,
  reducers: {
    increase: (state) => {
      return { id: state.id + 1 };
    },
  },
});
export const { increase } = actions;
export default reducer;
