import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import InputIdReducer, { name as inputId } from './input-id-store';

export const reducer = combineReducers({
  [inputId]: InputIdReducer,
});
export type RootState = ReturnType<typeof reducer>;
export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
