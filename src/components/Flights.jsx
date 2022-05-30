import React, { useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const Flight = ({ legs }) => {
  return (
    <div>
      {legs.map((leg) => {
        const { id, viewDuration, countTransfer, airline, departureCity, departureAirport, departureDate, arrivalCity, arrivalAirport, arrivalDate } = leg; 
        const transfer = countTransfer !== 0 ? `${countTransfer} пересадка` : '';
        const line = `${airline.airlineCode} ${airline.caption}`;
        return (
          <div key={id}>
            <Row className="border-bottom p-2">
              <span>{`${departureCity.caption}, ${departureAirport.caption} (${departureAirport.uid}) ->  ${arrivalCity.caption}, ${arrivalAirport.caption} (${arrivalAirport.uid})`}</span>
            </Row>
            <Row className="p-1">
              <Col className="text-start"><span>Дата/время вылета</span></Col>
              <Col className="text-center"><span>{viewDuration}</span></Col>
              <Col className="text-end"><span>Дата/время прилета</span></Col>
            </Row>
            <Row className="p-1">
              <span className="text-center">_________________________{transfer}_________________________</span>
            </Row>
            <Row className="p-1">
              <span>{`Рейс выполняет: ${line}`}</span>
            </Row>
            <Row className="border-bottom border-3 border-primary">
            </Row>
          </div> 
        )
     })}
   </div>
  )
};

const CardFlight = () => {
  const [countShow, setCountShow] = useState(0);
  const { allFlights } = useSelector((state) => state.flights);
  console.log(allFlights.length);
  if (allFlights.length === 0) {
    return null;
  }
  const showFlights = [...[allFlights[countShow]], ...[allFlights[countShow + 1]]];
  return (
    <div>
      {showFlights.map(({ id, carrier, amount, currency, legsFlight }) => {
        return (
          <React.Fragment key={id}>
          <Row className="bg-primary text-white flex-md-row">
          <Col>
            <span>логотип</span>
          </Col>
          <Col md="auto">
            <Row>
              <span className="text-end">{`${amount} ₽`}</span>
            </Row>
            <Row>
              <span className="text-end">Стоимость для одного взрослого пассажира</span>
            </Row>
          </Col>
        </Row>
        <Flight legs={legsFlight} />
        <Row className="pb-2">
          <Button variant="warning" size="sm" className="text-light">ВЫБРАТЬ</Button>
        </Row>
        </React.Fragment>
        );
      })}
    </div>
  );
};

const Flights = () => {
  return (
    <Col className="h-100 p-0">
     <Container>
        <CardFlight />
        <div className="d-flex justify-content-center">
            <Button variant="outline-dark" size="sm">Показать еще</Button>
        </div>
      </Container>
    </Col>
  );
};

export default Flights;

//<div className="d-flex flex-column h-100"></div>

//<div className="bg-primary text-white">