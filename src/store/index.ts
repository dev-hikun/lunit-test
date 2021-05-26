import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

export const reducer = combineReducers({});
export type RootState = ReturnType<typeof reducer>;
export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
