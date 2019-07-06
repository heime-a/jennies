'use strict;'
//@ts-check
import React from "react";
import { Table, Input, Button } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms

export default function PurchaseOrderForm({ item, onChange, onAddLine, onRemoveLine, ingData }) {
  return (
    <div id="purchaseOrderGrid">
      <div>PO Number: {item.poNumber}</div>
      <div>Supplier Name: {item.supplier.name}</div>
      <div>Supplier Address: {item.supplier.address}</div>
      <div>PO Status: NEW</div>
      <Button className="delete" color="success" onClick={onAddLine}>
        Add Row
      </Button>
      <Table>
        <thead>
          <IngredientHeader />
        </thead>
        <tbody>
          {item.ingredients.map((ing, idx) => (
            <IngredientLine ing={ing} idx={idx} ingData={ingData} onChange={onChange} onRemoveLine={onRemoveLine} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function IngredientHeader() {
  return <tr>
    <th>Amount</th>
    <th>Name</th>
    <th>Unit</th>
    <th>Unit Cost</th>
    <th>Total Cost</th>
  </tr>;
}

function IngredientLine({ ing, ingData, idx, onChange, onRemoveLine }) {
  return <tr key={ing.ingredient.name}>
    <td width="15%">
      <Input
        key={ing._id}
        type="text"
        name="quantity"
        value={ing.quantity}
        onChange={(e) => onChange(e, idx)}
      />{" "}
    </td>
    <td width="40%">
      <Typeahead
        options={Object.keys(ingData)}
        type="text"
        name="name"
        defaultInputValue={ing.ingredient.name}
        onChange={(val) => onChange({ target: { name: 'name', value: val[0] } }, idx)}
      />
    </td>
    <td width="15%">{ingData[ing.ingredient.name]}</td>
    <td width="15%">
      <Input
        key={idx}
        type="text"
        name="unitCost"
        value={ing.unitCost}
        onChange={(e) => onChange(e, idx)} /></td>
    <td width="15%">{(Math.floor(100 * ing.quantity * ing.unitCost) / 100).toFixed(2)}</td>
    <td><Button className="btn-danger delete" onClick={(e) => onRemoveLine(e, idx)}>x</Button></td>
  </tr>;

}

//
