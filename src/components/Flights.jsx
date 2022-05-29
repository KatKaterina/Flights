import React from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';

const Flight = () => {
  return (
    <div>
      <Row className="border-bottom p-2">
        <span>Москва {'->'}  Лондон</span>
      </Row>
      <Row className="p-1">
        <Col className="text-start"><span>Дата/время вылета</span></Col>
        <Col className="text-center"><span>Время полета</span></Col>
        <Col className="text-end"><span>Дата/время прилета</span></Col>
      </Row>
      <Row className="p-1">
          <span className="text-center">_________________________ 1 пересадка _________________________</span>
      </Row>
      <Row className="p-1">
          <span>Рейс выполняет: </span>
      </Row>
    </div>   
  );
};

const CardFlight = () => {
  return (
    <div>
      <Row className="bg-primary text-white flex-md-row">
        <Col>
          <span>логотип</span>
        </Col>
        <Col md="auto">
          <Row>
            <span className="text-end">цена</span>
          </Row>
          <Row>
            <span className="text-end">Стоимость для одного взрослого пассажира</span>
          </Row>
        </Col>
      </Row>
      <Flight />
      <Row className="border-bottom border-3 border-primary">
      </Row>
      <Flight />
      <Row className="pb-2">
        <Button variant="warning" size="sm" className="text-light">ВЫБРАТЬ</Button>
      </Row>
    </div>
  );
};

const Flights = () => {
  return (
    <Col className="h-100 p-0">
     <Container>
        <CardFlight />
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