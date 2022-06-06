import React, { useState, useEffect } from 'react';
import {
  Col,
  Container,
  Row, Button,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Flight = ({ legs }) => {
  const lengthLegs = legs.length;
  return (
    <div>
      {legs.map((leg, i) => {
        const {
          id,
          viewDuration,
          countTransfers,
          airline,
          departureCity,
          departureAirport,
          departureDateView,
          arrivalCity,
          arrivalAirport,
          arrivalDateView,
        } = leg;
        const valueTransfer = countTransfers === 1 ? '1 пересадка'
        : (countTransfers >= 4) ? `${countTransfers} пересадок`
                                      : `${countTransfers} пересадки`;
        const transfer = countTransfers !== 0 ? valueTransfer : '';
        const line = `${airline.airlineCode} ${airline.caption}`;
        return (
          <div key={id}>
            <Row className="border-bottom p-2">
              <div>
                <span>
                  {`${departureCity.caption}, ${departureAirport.caption}`}
                </span>
                <span className="text-primary">
                  {` (${departureAirport.uid})`} → 
                </span>
                <span>
                  {`${arrivalCity.caption}, ${arrivalAirport.caption}`}
                </span>
                <span className="text-primary">
                  {` (${arrivalAirport.uid})`}
                </span>
              </div>
            </Row>
            <Row className="p-1">
              <Col className="text-start">
                <span className="fs-5">
                  {departureDateView.timeView}
                </span>
                <span> </span>
                <span className="text-primary">
                  {departureDateView.dateView}
                </span>
              </Col>
              <Col className="text-center">
                <span className="fs-5">
                  🕔 {viewDuration}
                </span>
              </Col>
              <Col className="text-end">
                <span className="text-primary">
                  {arrivalDateView.dateView}
                </span>
                <span> </span>
                <span span className="fs-5">
                  {arrivalDateView.timeView}
                </span>
              </Col>
            </Row>
            <Row className="p-1">
              <Col className="border-bottom"/>
              <Col className="text-center"><span className="f-color-orange">{transfer}</span></Col>
              <Col className="border-bottom"/>  
            </Row>
            <Row className="p-1 fsize-14">
              <span>{`Рейс выполняет: ${line}`}</span>
            </Row>
            <Row className={i !== lengthLegs - 1 ? 'separator' : ''} />
          </div>
        );
      })}
    </div>
  );
};

const CardFlight = () => {
  const step = 2;
  const [countShowFlights, setCountShowFlights] = useState(step);

  useEffect(() => {}, [countShowFlights]);

  const { sortFlights } = useSelector((state) => state.flights);
  const lengthSortFlights = sortFlights.length;

  useEffect(() => {setCountShowFlights(step)}, [sortFlights]);

  const { loading } = useSelector((state) => state.flights);
  if (loading === 'loading') {
    return (
      <div className="text-center">
        <span>Идет загрузка данных</span>
      </div>
    );
  }
  if (loading === 'failed') {
    return (
      <div className="text-center">
        <span>Не удалось выполнить запрос</span>
      </div>
    );
  }

  if (lengthSortFlights === 0) {
    return (
      <div className="text-center">
        <span>Подходящих рейсов не найдено</span>
      </div>
    );
  }

  const count = Math.min(countShowFlights, lengthSortFlights);
  const showFlights = sortFlights.slice(0, count);

  const handleClick = () => {
    setCountShowFlights(countShowFlights + step);
  };

  return (
    <>
      <div>
        {showFlights.map(({ id, amount, legsFlight }) => (
          <React.Fragment key={id}>
            <Row className="bg-color-blue text-white flex-md-row lh-normal">
              <Col>
                <div>
                  <span>логотип</span>
                </div>
              </Col>
              <Col md="auto">
                <Row>
                  <span className="text-end fs-5">{`${amount} ₽`}</span>
                </Row>
                <Row>
                  <div>
                    <span className="text-end fsize-9">
                      Стоимость для одного взрослого пассажира
                    </span>
                  </div>
                </Row>
              </Col>
            </Row>
            <Flight legs={legsFlight} />
            <Row className="pb-4">
              <button type="button" className="text-light bg-color-orange no-border">ВЫБРАТЬ</button>
            </Row>
          </React.Fragment>
        ))}
      </div>
      <div className="d-flex justify-content-center">
        { count < lengthSortFlights ? <Button variant="outline-dark" size="sm" onClick={handleClick}>Показать еще</Button> : null }
      </div>
    </>
  );
};

const Flights = () => (
  <Col className="h-100 p-0">
    <Container>
      <CardFlight />
    </Container>
  </Col>
);

export default Flights;
