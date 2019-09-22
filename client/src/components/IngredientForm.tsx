import "./IngredientList.css";
import React from "react";
import { Col, Form, FormGroup, Label, Input } from "reactstrap";
import { Ingredient } from "./IngredientList";

const IngredientForm = ({
  item,
  onChange
}: {
  item: Ingredient;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { name, type, unit } = item;
  return (
    <div>
      <Form className="inputForm">
        <FormRow name="name" value={name} onChange={onChange} />
        <FormRow name="type" value={type} onChange={onChange} />
        <FormRow name="unit" value={unit} onChange={onChange} />
      </Form>
    </div>
  );
};

const FormRow = ({
  name,
  value,
  onChange
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const label = name[0].toUpperCase() + name.substring(1);
  return (
    <FormGroup row>
      <Label for={name} sm={2}>
        {label}
      </Label>
      <Col sm={10}>
        <Input type="text" name={name} value={value} onChange={onChange} />
      </Col>
    </FormGroup>
  );
};
export default IngredientForm;
