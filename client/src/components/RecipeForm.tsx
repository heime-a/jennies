"use strict;";
//@ts-check
import React from "react";
import { Table, Input, Button, Label } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { Recipe, RecipeLine } from "./RecipeList";
//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms
//TODO: Remove Trailing spaces from recipe names

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
  return (
    <div>
      <div id="recipeTop">
        <Label>Name</Label>
        <Input
          type="text"
          name="recipeName"
          value={item.name}
          onChange={onChange}
        />
        <Label>Man Hours</Label>
        <Input
          type="text"
          name="manHours"
          value={item.manHours}
          onChange={onChange}
        />
        <Button color="success" onClick={onAddLine}>
          Add Row
        </Button>
      </div>
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
      <th>Cost</th>
      <th>Ttl Cost</th>
    </tr>
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
  return (
    <tr key={idx}>
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
      <td>{ingData[ing.ingredient.name]["unit"]}</td>
      <td>
        {(
          Math.floor(ingData[ing.ingredient.name]["avgCost"] * 100) / 100
        ).toFixed(2)}
      </td>
      <td>
        {(
          Math.floor(
            ingData[ing.ingredient.name]["avgCost"] * ing.quantity * 100
          ) / 100
        ).toFixed(2)}
      </td>
      <td>
        <button onClick={e => onRemoveLine(idx)}>
          <i className="fas fa-trash"></i>
        </button>
      </td>{" "}
    </tr>
  );
}
