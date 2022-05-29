import React from 'react';
import { Col, Form, InputGroup, FormControl } from 'react-bootstrap';

const FormFilters = () => {
  return (
    <Form>
      <div className="mb-3">
        <span>Сортировать</span>
        <Form.Check type="radio" name="sort" label="по возрастанию цены" id="priceUp" />
        <Form.Check type="radio" name="sort" label="по убыванию цены" id="priceDown" />
        <Form.Check type="radio" name="sort" label="по времени в пути" id="time" />
      </div>
      <div className="mb-3">
        <span>Фильтровать</span>
        <Form.Check type="checkbox" name="filterTransfer" label="1 пересадка" id="oneTransfer" />
        <Form.Check type="checkbox" name="filterTransfer" label="без пересадок" id="noTransfer" />
      </div>
      <div className="mb-3">
        <span>Цена</span>
        <InputGroup className="mb-3" size="sm">
          <InputGroup.Text>От</InputGroup.Text>
          <FormControl type="number" />
        </InputGroup>
        <InputGroup className="mb-3" size="sm">
          <InputGroup.Text>До</InputGroup.Text>
          <FormControl type="number" />
        </InputGroup>
      </div>
      <div className="mb-3">
        <span>Авиакомпании</span>
        <Form.Check type="checkbox" name="filterCompany" label="Токийские авиалинии" id="Tokyo" />
        <Form.Check type="checkbox" name="filterCompany" label="Ирландские авиалинии" id="Dublin" />
      </div>
    </Form>
  );
};

const Filters = () => {
  return (
    <Col md="auto" className="px-0 bg-light h-100">
      <div className="d-flex justify-content-around">
        <FormFilters />
      </div>
    </Col>
  );
}

export default Filters;