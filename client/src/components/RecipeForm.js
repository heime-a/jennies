'use strict;'
//@ts-check
import React from "react";
import { Table, Input, Button, Label } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms
//TODO: Remove Trailing spaces from recipe names
export default function RecipeForm({ item, onChange, onAddLine, onRemoveLine, ingData }) {
  return <div>
    <div id="recipeTop">
      <Label>Name</Label>
      <Input type="text" name="recipeName" value={item.name} onChange={onChange} />
      <Label>Man Hours</Label>
      <Input type="text" name="manHours" value={item.manHours} onChange={onChange} />
      <Button color="success" onClick={onAddLine}>
        Add Row
        </Button>
    </div>
    <Table>
      <thead>
        <IngredientHeader />
      </thead>
      <tbody>
        {item.ingredients.map((ing, idx) =>
          <IngredientLine ing={ing} idx={idx} ingData={ingData} onChange={onChange} onRemoveLine={onRemoveLine} />
        )}
      </tbody>
    </Table>
  </div>;
}

function IngredientHeader() {
  return <tr>
    <th>Amount</th>
    <th>Name</th>
    <th>Unit</th>
    <th>Cost</th>
    <th>Ttl Cost</th>
  </tr>;
}
function IngredientLine({ ing, ingData, onChange, idx, onRemoveLine }) {
  return <tr key={ing._id}>
    <td width="15%">
      <Input key={idx} type="text" name="quantity" value={ing.quantity} onChange={e => onChange(e, idx)} />{" "}
    </td>
    <td width="40%">
      <Typeahead options={Object.keys(ingData)} type="text" name="name" defaultInputValue={ing.ingredient.name} onChange={val => onChange({ target: { name: "name", value: val[0] } }, idx)} />
    </td>
    <td width="15%">{ingData[ing.ingredient.name]["unit"]}</td>
    <td width="15%">{(Math.floor(ingData[ing.ingredient.name]["avgCost"] * 100) / 100).toFixed(2)}</td>
    <td width="15%">{(Math.floor(ingData[ing.ingredient.name]["avgCost"] * ing.quantity * 100) / 100).toFixed(2)}</td>
    <td><button onClick={(e) => onRemoveLine(e, idx)}>
      <i class="fas fa-trash"></i>
    </button></td>  </tr>;
}
//
