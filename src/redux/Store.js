import { configureStore } from '@reduxjs/toolkit';
import LoginReducer from './LoginSlice';

export const Store = configureStore({
  reducer: {
    userData: LoginReducer,
  },
})
