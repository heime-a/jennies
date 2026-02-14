import React, { useState, useEffect } from "react";
import { Button, Alert, Spinner } from "reactstrap";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";
import IngredientForm from "./IngredientForm";

export interface Ingredient {
  [index: string]: string;
  _id: string;
  name: string;
  type: string;
  unit: string;
}

export function IngredientList() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Ingredient[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [newItemsIndex, setNewItemsIndex] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  useEffect(() => {
    const loadIngredients = async () => {
      const response = await fetch(`${apiUrl()}/ingredients`);
      const jsonMessage = await response.json();
      if (jsonMessage) {
        setLoading(false);
        setContent(jsonMessage.content);
      }
    };
    loadIngredients();
  }, []);

  const handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(event.target.value);
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: Ingredient
  ) => {
    const idx = content.indexOf(item);
    const updated = content.map((ing, i) =>
      i === idx ? { ...ing, [event.target.name]: event.target.value } : ing
    );
    setContent(updated);
  };

  const saveSelected = async () => {
    const selectedItem = content.find((el) => el._id === selectedId);
    if (!selectedItem) return;

    const url = `${apiUrl()}/ingredients`;
    let data;

    if (selectedItem._id.includes("new")) {
      data = await postOrPutData(url, {
        name: selectedItem.name,
        type: selectedItem.type,
        unit: selectedItem.unit,
      });
    } else {
      data = await postOrPutData(
        `${url}/${selectedItem._id}`,
        { name: selectedItem.name, type: selectedItem.type, unit: selectedItem.unit },
        "PUT"
      );
    }
    if (data) setAlertMessage(data.message);
    setTimeout(() => setAlertMessage(undefined), 3000);
  };

  const newIngredient = () => {
    setContent([
      ...content,
      {
        _id: `new${newItemsIndex}`,
        name: "New Ingredient Here",
        type: "None",
        unit: "None",
      },
    ]);
    setNewItemsIndex(newItemsIndex + 1);
  };

  const foundItem = content.find((el) => el._id === selectedId);

  if (loading) {
    return (
      <div id="ingredientGrid">
        <Spinner color="secondary" style={{ width: '10rem', height: '10rem' }} type="grow" />
      </div>
    );
  }

  return (
    <div className="ingredientGrid">
      <select
        size={10}
        className="ingredientList"
        onChange={handleItemSelect}
      >
        {content.map((item) => (
          <option
            className="listItem"
            value={item._id}
            key={item._id}
          >{`${item.name} ${item.type} ${item.unit}`}</option>
        ))}
      </select>
      {foundItem && (
        <IngredientForm
          item={foundItem}
          onChange={(e) => handleFormChange(e, foundItem)}
        />
      )}
      <div className="ingButtons">
        <Button
          color="success"
          className="newIngredient"
          onClick={newIngredient}
        >
          New Ingredient
        </Button>
        <Button
          color="warning"
          className="saveIngredient"
          onClick={saveSelected}
        >
          Save Selected
        </Button>
      </div>
      {alertMessage && (
        <Alert
          color={alertMessage.includes("ERROR:") ? "danger" : "info"}
        >
          {alertMessage}
        </Alert>
      )}
    </div>
  );
}
