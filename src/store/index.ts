import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import polygon, { name as polygonName } from './polygon-store';
export const reducer = combineReducers({
  [polygonName]: polygon,
});
export type RootState = ReturnType<typeof reducer>;
export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
