import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './slices/index.js';

export default () => {
  return (
    <Provider store={store}>
      {console.log('1')}
    <App />
  </Provider>
  );
};
