import React, { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import Filters from './Filters';
import Flights from './Flights';
import { useDispatch } from 'react-redux';
import { fetchData } from '../slices/FlightsSlice.js';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  /*const { direct, oneConnection } = useSelector((state) => state.bestPrices);
  const */

  return (
    <div className="container h-100 my-4">
      <Row className="h-100 bg-white flex-md-row">
        <Filters />
        <Flights />
      </Row>
    </div>
  );
};

export default App;