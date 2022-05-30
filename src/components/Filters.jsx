import React from 'react';
import { Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const renderCompaniesList = () => {
  const { companiesPrices }= useSelector((state) => state.flights);
  const listCompanies = Object.entries(companiesPrices);

  return (
    <div className="mb-3">
      <span>Авиакомпании</span>
      {listCompanies.map(([uid, prop]) => {
        const { airlineCode, caption, amount, currency } = prop;
        const label = `- ${caption} от ${amount} ${currency}`;
        return (
          <Form.Check
            type="checkbox" 
            name="filterCompany" 
            label={label}
            id={uid}
            key={uid}
            />
        );
      })}
    </div> 
  );
};

const FormFilters = () => {
  return (
    <Form className="mr-5">
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
      {renderCompaniesList()}
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
};

export default Filters;