import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from './FlightsSlice.js';

export default configureStore({
    reducer: {
      flights: flightsReducer,
    },
  });