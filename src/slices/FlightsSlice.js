import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
//import getFlights from '../';
import testData from '../testData/flights.json';

const flightsAdapter = createEntityAdapter();

const initialState = flightsAdapter.getInitialState({
  channels: [],
  loading: '',
  error: null,
});

const data = JSON.parse(testData);
const flights = getFlights();