'use strict;'
//@ts-check
import React from "react";
import { Table, Input, Button } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms

export default function CustomerOrderForm({ order, onChange, onAddLine,onRemoveLine, productNames }) {
  return (
    <div id="customerOrderGrid">
      <div>PO Number: {order.coNumber}</div>
      <div>Customer Name: {order.customer.name}</div>
      <div>Customer Address: {order.customer.address}</div>
      <div>Order Status: NEW</div>
      <Button color="success" onClick={onAddLine}>
        Add Row
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Name</th>
            <th>Unit Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item,idx) => (
            <tr key={idx}>
              <td width="15%">
                <Input
                  key={idx}
                  type="text"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e)=>onChange(e,idx)}
                />{" "}
              </td>
              <td width="40%">
                <Typeahead
                  options={productNames}
                  type="text"
                  name="name"
                  defaultInputValue={item.name}
                  onChange={(val)=>onChange({target:{name:'name',value: val[0]}},idx)}
                />
              </td>
              <td width="15%">
              <Input
                  key={idx}
                  type="text"
                  name="unitCost"
                  value={item.unitCost}
                  onChange={(e)=>onChange(e,idx)}/></td>
              <td width="15%">{(Math.floor(100 * item.quantity * item.unitCost) / 100).toFixed(2) }</td>
              <td><Button onClick={(e) => onRemoveLine(e,idx)}>x</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

//
