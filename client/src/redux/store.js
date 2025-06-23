import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import busReducer from './slices/busSlice';
import offerReducer from './slices/offerSlice';
import destinationsReducder from './slices/destinationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bus: busReducer,
    offer: offerReducer,
    destinations: destinationsReducder
  },
});

export default store;