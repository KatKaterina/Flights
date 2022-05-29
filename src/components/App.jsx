import React from 'react';
import { Row } from 'react-bootstrap';
import Filters from './Filters';
import Flights from './Flights';

const App = () => {
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