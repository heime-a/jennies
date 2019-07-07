'use strict;'
//@ts-check
import React from "react";
import { Table, Input, Button } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms

export default function CustomerOrderForm({ order, productNames, onChange, onAddLine, onRemoveLine, }) {
  return (
    <div id="customerOrderGrid">
      <div>PO Number: {order.coNumber}</div>
      <div>Customer Name: {order.customer.name}</div>
      <div>Customer Address: {order.customer.address}</div>
      <div>Order Status: NEW</div>
      <Button className="delete" color="success" onClick={onAddLine}>
        Add Row
      </Button>
      <Table>
        <thead>
          <ProductHeader />
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <ProductLine item={item} idx={idx} productNames={productNames} onChange={onChange} onRemoveLine={onRemoveLine} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function ProductHeader() {
  return <tr>
    <th>Amount</th>
    <th>Name</th>
    <th>Unit Cost</th>
    <th>Total Cost</th>
  </tr>;
}

function ProductLine({ item, productNames, idx, onChange, onRemoveLine }) {
  return <tr key={idx}>
    <td width="15%">
      <Input
        key={idx}
        type="text"
        name="quantity"
        value={item.quantity}
        onChange={(e) => onChange(e, idx)}
      />{" "}
    </td>
    <td width="40%">
      <Typeahead
        options={productNames}
        type="text"
        name="name"
        defaultInputValue={item.name}
        onChange={(val) => onChange({ target: { name: 'name', value: val[0] } }, idx)}
      />
    </td>
    <td width="15%">
      <Input
        key={idx}
        type="text"
        name="unitCost"
        value={item.unitCost}
        onChange={(e) => onChange(e, idx)} /></td>
    <td width="15%">{(Math.floor(100 * item.quantity * item.unitCost) / 100).toFixed(2)}</td>
    <td><button onClick={(e) => onRemoveLine(e, idx)}>
      <i class="fas fa-trash"></i>
    </button></td></tr>;
}
//
