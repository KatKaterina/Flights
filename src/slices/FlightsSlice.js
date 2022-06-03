import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const flightsAdapter = createEntityAdapter();

const initialState = flightsAdapter.getInitialState({
  allFlights: [],
  sortFlights: [],
  valuesFilters: {
    filterTransfer: [],
    filterCompany: {},
  },
  typeSort: 'priceUp',
  activeFilters: {
    filterCompany: [],
    filterTransfer: [],
    filterPriceMin: [],
    filterPriceMax: [],
  },
  loading: '',
  error: null,
});

const testData = 'https://raw.githubusercontent.com/KatKaterina/Flights/main/src/testData/flights.json';

const fetchFun = async () => {
  const response = await fetch(testData);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  console.log('Ошибка HTTP: ' + response.status);
};

export const fetchData = createAsyncThunk('flights/fetchData', fetchFun);

const getCompaniesPrices = ({ DIRECT, ONE_CONNECTION }) => {
  const res = {};
  const listDirect = DIRECT.bestFlights;
  const listOneConnection = ONE_CONNECTION.bestFlights;
  const list = [...listDirect, ...listOneConnection];
  list.forEach((el) => {
    const { uid, airlineCode, caption } = el.carrier;
    const { amount, currency } = el.price;
    const amountNumber = Number(amount);
    if (!res.hasOwnProperty(uid)) {
      res[uid] = {
        airlineCode,
        caption,
        amount: amountNumber,
        currency,
        active: true,
      };
    } else {
      const currentProp = res[uid];
      if (currentProp.amount > amountNumber) {
        const updateProp = { ...currentProp, amount: amountNumber, currency };
        res[uid] = updateProp;
      }
    }
  });
  return res;
};

const getViewDuration = (value) => {
  const hour = Math.floor(value / 60);
  const min = value % 60;
  return `${hour} ч ${min} мин`;
};

const getDateTime = (dateString) => {
  const months = ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];
  const daysWeek = ['вс.', 'пн.', 'вт.', 'ср.', 'чт.', 'пт.', 'сб.'];

  const date = new Date(Date.parse(dateString));
  const day = date.getDate();
  const month = months[date.getMonth()];
  const dayWeek = daysWeek[date.getDay()];

  const hour = date.getHours();
  const minute = date.getMinutes();
  const minuteView = (minute < 10) ? '0' + minute : minute;
  const hourView = (hour < 10) ? '0' + hour : hour;
  const timeView = `${hourView}:${minuteView}`;
  const dateView = `${day} ${month} ${dayWeek}`;
  return { timeView, dateView };
};

const isValidData = (obj, objModel = '') => {
  const fullModel = {
    carrier: {
      uid: '',
      caption: '',
      airlineCode: '',
    },
    amount: '',
    currency: '',
    legsFlight: {
      departureCity: {
        uid: '',
        caption: '',
      },
      departureAirport: {
        uid: '',
        caption: '',
      },
      departureDate: '',
      arrivalCity: {
        uid: '',
        caption: '',
      },
      arrivalAirport: {
        uid: '',
        caption: '',
      },
      arrivalDate: '',
      airline: {
        uid: '',
        caption: '',
        airlineCode: '',
      },
      duration: '',
    },
  };

  const model = objModel === '' ? fullModel : objModel;
  const entries = Object.entries(model);
  let res = true;

  for (const item of entries) {
    const [key, value] = item;
    if (!obj.hasOwnProperty(key)) {
      res = false;
      break;
    }
    if (obj[key] === undefined) {
      res = false;
      break;
    }
    if (Array.isArray(obj[key])) {
      for (const el of obj[key]) {
        res = isValidData(el, value);
        if (!res) {
          break;
        }
      };
    } else if (typeof obj[key] === 'object') {
      res = isValidData(obj[key], value);
      if (!res) {
        break;
      }
    }
  }
  return res;
};

const getFlights = (data) => {
  const flightsList = [];
  const allTransfers = [];
  data.forEach((el, indexFlight) => {
    const dataFlight = el.flight;
    const { carrier, legs, price } = dataFlight;
    const { amount, currency } = price.passengerPrices[0].singlePassengerTotal;

    const legsFlight = [];
    let allDuration = 0;
    const transfersFlight = [];

    if (legs.length === 0) {
      return;
    }

    legs.forEach((leg, indexLeg) => {
      const countSegments = leg.segments.length;
      if (countSegments === 0) {
        return;
      }

      const departureCity = leg.segments[0].departureCity;
      const departureAirport = leg.segments[0].departureAirport;
      const departureDate = leg.segments[0].departureDate;
      const arrivalCity = leg.segments[countSegments - 1].arrivalCity;
      const arrivalAirport = leg.segments[countSegments - 1].arrivalAirport;
      const arrivalDate = leg.segments[countSegments - 1].arrivalDate;
      const countTransfers = countSegments - 1;
      const duration = Number(leg.duration);
      const airline = leg.segments[0].airline;
      const newLeg = {
        id: `${indexFlight}-${indexLeg}`,
        duration,
        viewDuration: getViewDuration(duration),
        countTransfers,
        airline,
        departureCity,
        departureAirport,
        departureDate,
        departureDateView: getDateTime(departureDate),
        arrivalCity,
        arrivalAirport,
        arrivalDate,
        arrivalDateView: getDateTime(arrivalDate),
      };
      transfersFlight.push(countTransfers);
      legsFlight.push(newLeg);
      allDuration += duration;
      if (allTransfers.indexOf(countTransfers) === -1) {
        allTransfers.push(countTransfers);
      }
    });

    const flight = {
      id: `${carrier.uid}-${indexFlight}`,
      carrier,
      amount: Number(amount),
      currency,
      allDuration,
      legsFlight,
      maxCountTransfers: Math.max(...transfersFlight),
    };
    if (isValidData(flight)) {
      flightsList.push(flight);
    } else {
      console.log(flight);
    }
  });

  allTransfers.sort((a, b) => a - b);
  const transfers = allTransfers.map((item) => ({ value: item, active: true, select: false }));
  return { flightsList, transfers };
};

const getSortFlights = (flights, typeSort = 'priceUp') => {
  const sortList = flights.slice();
  if (typeSort === 'priceUp') {
    sortList.sort((a, b) => a.amount - b.amount);
  } else if (typeSort === 'priceDown') {
    sortList.sort((a, b) => b.amount - a.amount);
  } else if (typeSort === 'time') {
    sortList.sort((a, b) => a.allDuration - b.allDuration);
  }
  return sortList;
};

const getFilteredFlights = (flights, activeFilters, exceptFilter = '', typeFilter = '') => {
  const entries = Object.entries(activeFilters);
  let filters = exceptFilter === '' ? entries : entries.filter(([key, value]) => key !== exceptFilter);
  filters = typeFilter === '' ? filters : filters.filter(([key, value]) => key === typeFilter);

  let filtredFlights = [...flights];
  let filtredList;

  for (const filter of filters) {
    const [type, dataFilter] = filter;
    if (dataFilter.length === 0) {
      continue;
    }

    if (type === 'filterTransfer') {
      filtredList = filtredFlights.filter((flight) => {
        const countTransfers = flight.maxCountTransfers;
        return dataFilter.indexOf(String(countTransfers)) !== -1;
      });
    } else if (type === 'filterPriceMin') {
      filtredList = filtredFlights.filter((flight) => {
        return (flight.amount >= dataFilter[0]);
      });
    } else if (type === 'filterPriceMax') {
      filtredList = filtredFlights.filter((flight) => {
        return (flight.amount <= dataFilter[0]);
      });
    } else if (type === 'filterCompany') {
      filtredList = filtredFlights.filter((flight) => {
        const uid = flight.carrier.uid;
        return dataFilter.indexOf(uid) !== -1;
      });
    }
    filtredFlights = filtredList;
  }
  return filtredFlights;
};

const getUpdatedFilters = (allFlights, valuesFilters, activeFilters, exceptFilter = '') => {
  let transfers = [...valuesFilters.filterTransfer];
  let companies = { ...valuesFilters.filterCompany };

  const filters = Object.entries(valuesFilters);
  for (const filter of filters) {
    const [type, values] = filter;
    if (type === exceptFilter) {
      continue;
    }
    if (type === 'filterTransfer') {
      const arrTransfers = getFilteredFlights(allFlights, activeFilters, type)
        .map((item) => item.maxCountTransfers);
      transfers = values.map(({ value, active }) => {
        if (arrTransfers.indexOf(value) !== -1) {
          return { value, active: true };
        }
        return { value, active: false };
      });
    }

    if (type === 'filterCompany') {
      const arrCompanies = getFilteredFlights(allFlights, activeFilters, type)
        .map((item) => item.carrier.uid);
      for (let key in values) {
        if (arrCompanies.indexOf(key) !== -1) {
          values[key].active = true;
        } else {
          values[key].active = false;
        }
      }
      companies = values;
    }
  }
  return { transfers, companies };
};

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    sortFlights: (state, action) => {
      const typeSort = action.payload;
      state.sortFlights = getSortFlights(state.sortFlights, typeSort);
      state.typeSort = typeSort;
    },
    addFilter: (state, action) => {
      const { name, value } = action.payload;
      if (name === 'filterPriceMin' || name === 'filterPriceMax') {
        state.activeFilters[name] = value !== '' ? [Number(value)] : [];
      } else {
        state.activeFilters[name].push(value);
      }
      const filtredFlights = getFilteredFlights(state.allFlights, state.activeFilters);
      state.sortFlights = getSortFlights(filtredFlights, state.typeSort);
    },
    deleteFilter: (state, action) => {
      const { name, value } = action.payload;
      state.activeFilters[name] = state.activeFilters[name].filter((val) => val !== value);
      const filtredFlights = getFilteredFlights(state.allFlights, state.activeFilters);
      state.sortFlights = getSortFlights(filtredFlights, state.typeSort);
    },
    updateFilters: (state, action) => {
      const exceptFilter = action.payload;
      const { transfers, companies } = getUpdatedFilters(state.allFlights, state.valuesFilters, state.activeFilters, exceptFilter);
      state.valuesFilters.filterTransfer = transfers;
      state.valuesFilters.filterCompany = companies;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const { result } = action.payload;
        const { bestPrices, flights } = result;
        const { flightsList, transfers } = getFlights(flights);
        state.allFlights = flightsList;
        state.valuesFilters.filterTransfer = transfers;
        state.valuesFilters.filterCompany = getCompaniesPrices(bestPrices);
        state.sortFlights = getSortFlights(state.allFlights);
        state.loading = 'succes';
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error;
      });
  },
});

export const {
  sortFlights,
  addFilter,
  deleteFilter,
  updateFilters,
} = flightsSlice.actions;
export default flightsSlice.reducer;
