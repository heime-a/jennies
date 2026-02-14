//@ts-check
import React from "react";
import { Table, Input, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { Order, Item } from "./CustomerOrderList";
import CustomerOrderList from "./CustomerOrderList";

export interface FormChangeEvent {
  target: { name: string; value: string };
}
export default function CustomerOrderForm({
  order,
  productNames,
  onChange,
  onAddLine,
  onRemoveLine
}: {
  order: Order;
  productNames: Array<string>;
  onChange: (e: FormChangeEvent, idx: number) => void;
  onAddLine: () => void;
  onRemoveLine: (idx: number) => void;
}) {
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
            <ProductLine
              item={item}
              idx={idx}
              productNames={productNames}
              onChange={onChange}
              onRemoveLine={onRemoveLine}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function ProductHeader() {
  return (
    <tr>
      <th>Amount</th>
      <th>Name</th>
      <th>Unit Cost</th>
      <th>Total Cost</th>
    </tr>
  );
}

function ProductLine({
  item,
  productNames,
  idx,
  onChange,
  onRemoveLine
}: {
  item: Item;
  productNames: Array<string>;
  idx: number;
  onChange: (e: FormChangeEvent, idx: number) => void;
  onRemoveLine: (idx: number) => void;
}) {
  return (
    <tr key={idx}>
      <td style={{ width: "10%" }}>
        <Input
          key={idx}
          type="text"
          name="quantity"
          value={item.quantity}
          onChange={e => onChange(e, idx)}
        />{" "}
      </td>
      <td>
        <Typeahead
          options={productNames}
          defaultInputValue={item.name}
          onChange={val =>
            onChange({ target: { name: "name", value: val[0] as string } }, idx)
          }
        />
      </td>
      <td style={{ width: "15%" }}>
        <Input
          key={idx}
          type="text"
          name="unitCost"
          value={item.unitCost}
          onChange={e => onChange(e, idx)}
        />
      </td>
      <td>
        {(Math.floor(100 * item.quantity * item.unitCost) / 100).toFixed(2)}
      </td>
      <td>
        <button onClick={e => onRemoveLine(idx)}>
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}
