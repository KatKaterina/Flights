import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './slices/index.js';

//import testData from './testData/flights.json';
//const data = JSON.parse(testData);

/*const testData = './testData/flights.json';
fetch(testData)
   .then(response => response.json())
   .then(json => {
       // console.log(json);
   })*/

//import fs from 'fs';
//import path from 'path';
const fs = require('fs');
const path = require('path');

const testFile = './testData/flights.json'; 
const getData = (file) => fs.readFileSync(path.resolve(process.cwd(), file.trim()), 'utf-8');
const dataFile = getData(testFile);
const data = JSON.parse(dataFile);

export default () => {
  return (
    <Provider store={store}>
      {console.log(data)}
    <App />
  </Provider>
  );
};
