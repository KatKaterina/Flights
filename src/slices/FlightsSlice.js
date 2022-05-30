import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const flightsAdapter = createEntityAdapter();

const initialState = flightsAdapter.getInitialState({
  bestPrices: null,
  allFlights: [],
  companiesPrices: {},
  loading: '',
  error: null,
});


const testData = 'https://raw.githubusercontent.com/KatKaterina/Flights/main/src/testData/flights.json';
//const testData = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';

const fetchFun = async () => {
  const response = await fetch(testData);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
};

export const fetchData = createAsyncThunk('flights/fetchData', fetchFun); 

const getCompaniesPrices = ({ DIRECT, ONE_CONNECTION }) => {
  const res = {};
  const listDirect = DIRECT.bestFlights;
  const listOneConnection = ONE_CONNECTION.bestFlights;
  const list = [...listDirect,...listOneConnection];
  //console.log(list);
    list.forEach(el => {
    const { uid, airlineCode, caption } = el.carrier;
    const { amount, currency } = el.price;
    const amountNumber = Number(amount);
    if (!res.hasOwnProperty(uid)) {
      res[uid] = {
        airlineCode: airlineCode,
        caption: caption,
        amount: amountNumber,
        currency: currency,
      };
    } else {
      const currentProp = res[uid];
      if (currentProp.amount > amountNumber) {
        const updateProp = {...currentProp, amount: amountNumber, currency};
        res[uid] = updateProp;
      }
    }
  });
  console.log(res);
  return res;
};

const getViewDuration = (value) => {
  const hour = Math.floor(value/60);
  const min = value%60;
  return `${hour} ч ${min} мин`;
};

const getFlights = (data) => {
  const flights = [];
  data.forEach((el, indexFlight) => {
    const dataFlight = el.flight;
    const { carrier, legs, price } = dataFlight;
    const { amount, currency } = price.passengerPrices[0].singlePassengerTotal;

    const legsFlight = [];
    legs.forEach((leg, indexLeg) => {
      const countSegments = leg.segments.length;
      const departureCity = leg.segments[0].departureCity;
      const departureAirport = leg.segments[0].departureAirport;
      const departureDate = leg.segments[0].departureDate;
      const arrivalCity = leg.segments[countSegments - 1].arrivalCity;
      const arrivalAirport = leg.segments[countSegments - 1].arrivalAirport;
      const arrivalDate = leg.segments[countSegments - 1].arrivalDate;
      const countTransfer = countSegments - 1;
      const duration = leg.duration;
      const airline = leg.segments[0].airline;
      const newLeg = {
        id: `${indexFlight}-${indexLeg}`,
        duration: Number(duration),
        viewDuration: getViewDuration(Number(duration)),
        countTransfer,
        airline,
        departureCity,
        departureAirport,
        departureDate,
        arrivalCity,
        arrivalAirport,
        arrivalDate,
      };
      legsFlight.push(newLeg);
    }) 
    const flight = {
      id: `${carrier.uid}-${indexFlight}`,
      carrier,
      amount: Number(amount),
      currency,
      legsFlight,
    };
    flights.push(flight);
  });
  console.log('флайтс');
  console.log(flights);
  return flights;
};

const flightsSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchData.fulfilled, (state, action) => {
          //console.log(action.payload.result);
          //console.log(state);
          const { result } = action.payload; 
          const { bestPrices, flights } = result;
          //console.log(bestPrices)
          state.bestPrices = bestPrices;
          state.allFlights = getFlights(flights);
          state.companiesPrices = getCompaniesPrices(bestPrices);

            //const { channels, currentChannelId } = action.payload;
          // channelsAdapter.setAll(state, channels);
          /*state.channels = [...channels];
          state.currentChannelId = state.currentChannelId === undefined ? currentChannelId
            : state.currentChannelId;
          state.defaultChannelId = _.first(channels).id;*/
          state.loading = 'succes';
          state.error = null;
          console.log(state.allFlights);
          //console.log(bestPrices);
        })
        .addCase(fetchData.rejected, (state, action) => {
          console.log(action.error);
          state.loading = 'failed';
          state.error = action.error;
        });
    },
  });
  
  //export const {changeCurrentChannel } = flightsSlice.actions;
  /*export const selectorFlights = flightsAdapter.getSelectors((state) => state.fligths);
  export const selectorBestPrices = flightsAdapter.getSelectors((state) => state.bestPrices);
  export const selectorCompaniesPrices = flightsAdapter.getSelectors((state) => state.companiesPrices);*/
  export default flightsSlice.reducer;