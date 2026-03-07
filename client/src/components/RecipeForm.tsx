import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button, Input, Label, Table, Row, Col, FormGroup } from "reactstrap";
import { Recipe, RecipeLine } from "./RecipeList";

export default function RecipeForm({
  item,
  onChange,
  onAddLine,
  onRemoveLine,
  ingData
}: {
  item: Recipe;
  onChange: any;
  onAddLine: () => void;
  onRemoveLine: (idx: number) => void;
  ingData: { [index: string]: { unit: string; avgCost: number } };
}) {
  const totalIngredientCost = item.ingredients.reduce((acc, ing) => {
    const data = ingData[ing.ingredient.name];
    return acc + (data ? data.avgCost * ing.quantity : 0);
  }, 0);

  return (
    <div id="recipeFormCard">
      <div className="recipe-header">
        <h4>Recipe: {item.name}</h4>
        <Button color="success" size="sm" onClick={onAddLine}>
          <i className="fas fa-plus me-2"></i>Add Ingredient
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <FormGroup>
            <Label className="small fw-bold text-muted text-uppercase">Recipe Name</Label>
            <Input
              type="text"
              name="recipeName"
              value={item.name}
              onChange={onChange}
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label className="small fw-bold text-muted text-uppercase">Man Hours</Label>
            <Input
              type="number"
              step="0.1"
              name="manHours"
              value={item.manHours}
              onChange={onChange}
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
      </Row>

      <div className="recipe-stats">
        <div className="stat-item">
          <span className="stat-label">Total Material Cost</span>
          <span className="stat-value text-accent">${totalIngredientCost.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ingredients</span>
          <span className="stat-value">{item.ingredients.length} items</span>
        </div>
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Qty</th>
              <th>Ingredient</th>
              <th style={{ width: "12%" }}>Unit</th>
              <th style={{ width: "15%" }}>Avg Cost</th>
              <th style={{ width: "15%" }}>Total</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {item.ingredients.map((ing, idx) => (
              <IngredientLine
                key={`${item._id}-recipe-line-${idx}`}
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
    </div>
  );
}

function IngredientLine({
  ing,
  ingData,
  onChange,
  idx,
  onRemoveLine
}: {
  ing: RecipeLine;
  ingData: { [index: string]: { unit: string; avgCost: number } };
  onChange: (e: any, idx: number) => void;
  idx: number;
  onRemoveLine: (idx: number) => void;
}) {
  const data = ingData[ing.ingredient.name];
  const avgCost = data ? data.avgCost : 0;
  const unit = data ? data.unit : '-';

  return (
    <tr>
      <td>
        <Input
          type="number"
          step="0.01"
          name="quantity"
          value={ing.quantity}
          onChange={e => onChange(e, idx)}
          className="form-control-sm"
        />
      </td>
      <td>
        <Typeahead
          id={`recipe-typeahead-${idx}`}
          options={Object.keys(ingData)}
          defaultInputValue={ing.ingredient.name}
          onChange={val =>
            onChange({ target: { name: "name", value: val[0] } }, idx)
          }
          className="typeahead-sm"
        />
      </td>
      <td className="small text-muted">{unit}</td>
      <td className="small">${avgCost.toFixed(2)}</td>
      <td className="fw-medium">${(avgCost * ing.quantity).toFixed(2)}</td>
      <td className="text-center">
        <button className="btn-remove" title="Remove line" onClick={() => onRemoveLine(idx)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
}
