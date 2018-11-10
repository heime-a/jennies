'use strict;'
import React from "react";
import { Table, Input, Button } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms

export default function PurchaseOrderForm({ item, onChange, onAddLine, ingNames }) {
  return (
    <div id="purchaseOrderGrid">
      <div>PO Number: {item.poNumber}</div>
      <div>Supplier Name: {item.supplier.name}</div>
      <div>Supplier Address: {item.supplier.address}</div>
      <div>PO Status: NEW</div>
      <Button color="success" onClick={onAddLine}>
        Add Row
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Unit Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {item.ingredients.map((ing,idx) => (
            <tr key={ing._id}>
              <td width="15%">
                <Input
                  key={idx}
                  type="text"
                  name="quantity"
                  value={ing.quantity}
                  onChange={(e)=>onChange(e,ing)}
                />{" "}
              </td>
              <td width="40%">
                <Typeahead
                  options={ingNames}
                  type="text"
                  name="name"
                  defaultInputValue={ing.ingredient.name}
                  onChange={(val)=>onChange({target:{name:'name',value: val[0]}},ing)}
                />
              </td>
              <td width="15%">{ing.ingredient.unit}</td>
              <td width="15%">{9.99}</td>
              <td width="15%">{9.99}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

//
