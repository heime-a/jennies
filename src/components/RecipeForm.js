'use strict;'
//@ts-check
import React from "react";
import { Table, Input, Button, Label } from "reactstrap";
import { Typeahead } from 'react-bootstrap-typeahead';

//import { Col, Form, FormGroup, Label, Input } from 'reactstrap'; maybe needed for forms

export default function RecipeForm({ item, onChange, onAddLine,onRemoveLine, ingNames }) {
  return <div>
        <div id="recipeTop">
          <Label>Name</Label> 
          <Input type="text" name="recipeName" value={item.name} onChange={onChange}/>
          <Label>Man Hours</Label>
          <Input type="text" name="manHours" value={item.manHours} onChange={onChange} />
          <Button color="success" onClick={onAddLine}>
           Add Row
          </Button>
        </div>
      <Table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Cost</th>
            <th>Ttl Cost</th>
          </tr>
        </thead>
        <tbody>
          {item.ingredients.map((ing, idx) => <tr key={ing._id}>
              <td width="15%">
                <Input key={idx} type="text" name="quantity" value={ing.quantity} onChange={e => onChange(e, idx)} />{" "}
              </td>
              <td width="40%">
                <Typeahead options={ingNames} type="text" name="name" defaultInputValue={ing.ingredient.name} onChange={val => onChange({ target: { name: "name", value: val[0] } }, idx)} />
              </td>
              <td width="15%">{ing.ingredient.unit}</td>
              <td width="15%">{9.99}</td>
              <td width="15%">{9.99}</td>
              <td>
                <Button onClick={e => onRemoveLine(e, idx)}>x</Button>
              </td>
            </tr>)}
        </tbody>
      </Table>
    </div>;
}

//
