import React from "react";
import { Table, Input, Button, Row, Col } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { Po, LineItem } from "./PurchaseOrderList";

interface PurchaseOrderFormProps {
  item: Po;
  onChange: (e: any, idx: number) => void;
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
  const totalPO = item.ingredients.reduce((acc, ing) => acc + (ing.quantity * ing.unitCost), 0);

  return (
    <div id="purchaseOrderGrid">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4>PO #{item.poNumber}</h4>
          <div className="text-muted small">Status: <span className="badge bg-info text-white">NEW</span></div>
        </div>
        <Button className="btn-add-line" color="success" size="sm" onClick={onAddLine}>
          <i className="fas fa-plus me-2"></i>Add Item
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <div className="label small text-muted text-uppercase fw-bold mb-1">Supplier</div>
          <div className="fw-bold">{item.supplier.name}</div>
          <div className="small text-muted">{item.supplier.address}</div>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Qty</th>
              <th>Ingredient</th>
              <th style={{ width: "12%" }}>Unit</th>
              <th style={{ width: "15%" }}>Unit Cost</th>
              <th style={{ width: "15%" }}>Total</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {item.ingredients.map((ing, idx) => (
              <IngredientLine
                key={`${item._id}-line-${idx}`}
                ing={ing}
                idx={idx}
                ingData={ingData}
                onChange={onChange}
                onRemoveLine={onRemoveLine}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold">Total Order:</td>
              <td className="fw-bold text-accent">${totalPO.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
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
    <tr>
      <td>
        <Input
          type="number"
          name="quantity"
          value={ing.quantity}
          onChange={e => onChange(e, idx)}
          className="form-control-sm"
        />
      </td>
      <td>
        <Typeahead
          id={`typeahead-${idx}`}
          options={Object.keys(ingData)}
          defaultInputValue={ing.ingredient.name}
          onChange={val =>
            onChange({ target: { name: "name", value: val[0] } }, idx)
          }
          className="typeahead-sm"
        />
      </td>
      <td className="small text-muted">{ingData[ing.ingredient.name] || '-'}</td>
      <td>
        <div className="input-group input-group-sm">
          <span className="input-group-text">$</span>
          <Input
            type="number"
            step="0.01"
            name="unitCost"
            value={ing.unitCost}
            onChange={e => onChange(e, idx)}
          />
        </div>
      </td>
      <td className="fw-medium">
        ${(ing.quantity * ing.unitCost).toFixed(2)}
      </td>
      <td className="text-center">
        <button className="btn-remove" title="Remove line" onClick={() => onRemoveLine(idx)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
}
