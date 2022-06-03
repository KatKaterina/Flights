import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  sortFlights,
  addFilter,
  deleteFilter,
  updateFilters,
} from '../slices/FlightsSlice.js';

const Sort = ({ handleChange }) => (
  <div className="mb-3">
    <div className="pb-2">
      <span className="f-bold">Сортировать</span>
    </div>
    <Form.Check type="radio" name="sort" label="по возрастанию цены" id="priceUp" value="priceUp" onChange={handleChange} />
    <Form.Check type="radio" name="sort" label="по убыванию цены" id="priceDown" value="priceDown" onChange={handleChange} />
    <Form.Check type="radio" name="sort" label="по времени в пути" id="time" value="time" onChange={handleChange} />
  </div>
);

const CompaniesFilter = ({ handleChange, companies }) => {
  const listCompanies = Object.entries(companies);
  return (
    <div className="mb-3">
      <div className="pb-2">
        <span className="f-bold">Авиакомпании</span>
      </div>
      {listCompanies.map(([uid, prop]) => {
        const {
          caption,
          amount,
          currency,
          active,
        } = prop;
        const label = `- ${caption} от ${amount} ${currency}`;
        return (
          <Form.Check
            type="checkbox"
            name="filterCompany"
            label={label}
            onChange={handleChange}
            value={uid}
            key={uid}
            disabled={!active}
            className="text-truncate"
          />
        );
      })}
    </div>
  );
};

const TransferFilter = ({ handleChange, transfers }) => (
  <div className="mb-3">
    <div className="pb-2">
      <span className="f-bold">Фильтровать</span>
    </div>
    {transfers.map(({ value, active }) => {
      const count = value === 0 ? 'без' : value;
      const label = value === 1 ? '1 пересадка'
        : (value >= 4 || value === 0) ? `${count} пересадок`
                                      : `${count} пересадки`;
      return (
        <Form.Check
          type="checkbox"
          name="filterTransfer"
          label={label}
          onChange={handleChange}
          value={value}
          key={value}
          disabled={!active}
        />
      );
    })}
  </div>
);

const PriceFilter = ({ handleChange }) => (
  <div className="mb-3">
    <div className="pb-2">
      <span className="f-bold">Цена</span>
    </div>
    <div className="mb-3">
      <label htmlFor="filterPriceMin"><span>От </span></label>
      <input type="number" name="filterPriceMin" onChange={handleChange} id="filterPriceMin" />
    </div>
    <div className="mb-3">
      <label htmlFor="filterPriceMax">До</label>
      <input type="number" name="filterPriceMax" onChange={handleChange} id="filterPriceMax" />
    </div>
  </div>
);

const FormFilters = () => {
  const { valuesFilters } = useSelector((state) => state.flights);
  const { filterTransfer, filterCompany } = valuesFilters;

  const dispatch = useDispatch();

  const handleChangeSort = (e) => {
    dispatch(sortFlights(e.target.value));
  };

  const handleChangeFilter = (e) => {
    const { name, checked, value } = e.target;
    if (checked || name === 'filterPriceMin' || name === 'filterPriceMax') {
      dispatch(addFilter({ name, value }));
    } else {
      dispatch(deleteFilter({ name, value }));
    }
    const exceptFilter = name;
    dispatch(updateFilters(exceptFilter));
  };

  return (
    <Form className="mr-5">
      <Sort handleChange={handleChangeSort} />
      <TransferFilter handleChange={handleChangeFilter} transfers={filterTransfer} />
      <PriceFilter handleChange={handleChangeFilter} />
      <CompaniesFilter handleChange={handleChangeFilter} companies={filterCompany} />
    </Form>
  );
};

const Filters = () => (
  <Col md="auto" className="px-0 h-100 fsize-12">
    <div className="d-flex justify-content-around">
      <FormFilters />
    </div>
  </Col>
);

export default Filters;
