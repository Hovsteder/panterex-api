import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ratesReducer from './slices/ratesSlice';
import commissionsReducer from './slices/commissionsSlice';
import configReducer from './slices/configSlice';
import usersReducer from './slices/usersSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rates: ratesReducer,
    commissions: commissionsReducer,
    config: configReducer,
    users: usersReducer,
    analytics: analyticsReducer,
  },
});