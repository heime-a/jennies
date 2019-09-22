"use strict;";
//@ts-check
import React, { ReactElement } from "react";
import { Table, Input, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import PurchaseOrderList, { Po, LineItem } from "./PurchaseOrderList";

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms
interface PurchaseOrderFormProps {
  item: Po;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, idx: number) => void;
  onAddLine: () => void;
  onRemoveLine: (idx: number) => void;
  ingData: {
    [index: string]: string;
  };
}
export default function PurchaseOrderForm({
  item,
  onChange,
  onAddLine,
  onRemoveLine,
  ingData
}: PurchaseOrderFormProps) {
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
            <IngredientLine
              ing={ing}
              idx={idx}
              ingData={ingData}
              onChange={onChange}
              onRemoveLine={onRemoveLine}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function IngredientHeader() {
  return (
    <tr>
      <th>Amount</th>
      <th>Name</th>
      <th>Unit</th>
      <th>Unit Cost</th>
      <th>Total Cost</th>
    </tr>
  );
}

function IngredientLine({
  ing,
  ingData,
  idx,
  onChange,
  onRemoveLine
}: {
  ing: LineItem;
  ingData: {
    [index: string]: string;
  };
  idx: number;
  onChange: (e: any, idx: number) => void;
  onRemoveLine: (idx: number) => void;
}) {
  return (
    <tr key={ing.ingredient.name}>
      <td>
        <Input
          key={idx}
          type="text"
          name="quantity"
          value={ing.quantity}
          onChange={e => onChange(e, idx)}
        />{" "}
      </td>
      <td>
        <Typeahead
          options={Object.keys(ingData)}
          defaultInputValue={ing.ingredient.name}
          onChange={val =>
            onChange({ target: { name: "name", value: val[0] } }, idx)
          }
        />
      </td>
      <td>{ingData[ing.ingredient.name]}</td>
      <td>
        <Input
          key={idx}
          type="text"
          name="unitCost"
          value={ing.unitCost}
          onChange={e => onChange(e, idx)}
        />
      </td>
      <td>
        {(Math.floor(100 * ing.quantity * ing.unitCost) / 100).toFixed(2)}
      </td>
      <td>
        <button onClick={e => onRemoveLine(idx)}>
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}

//
