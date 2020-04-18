"use strict;";
//@ts-check
import "./RecipeList.css";
import React, { useState, useEffect } from "react";
import { Button, Alert } from "reactstrap";
import RecipeForm from "./RecipeForm";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";
import { Ingredient } from "./IngredientList";

export interface RecipeLine {
  ingredient: Ingredient;
  quantity: number;
}

export interface Recipe {
  _id: string;
  name: string;
  manHours: number;
  ingredients: Array<RecipeLine>;
}

interface RecipeListState {
  content: Array<Recipe>;
  selectedId: string;
  ingData: {
    [index: string]: { unit: string; avgCost: number };
  };
  alertMessage?: string;
}

export const RecipeList = () => {
  const [recipeList, setRecipeList] = useState<RecipeListState>({
    content: [
      {
        _id: `new001`,
        name: `new001`,
        manHours: 0,
        ingredients: [
          {
            ingredient: {
              _id: "",
              name: "New Item",
              type: "N/A",
              unit: "N/A",
            },
            quantity: 0,
          },
        ],
      },
    ],
    selectedId: "",
    ingData: {
      newItem: {
        unit: "Oz.",
        avgCost: 0.01,
      },
    },
    alertMessage: "",
  });

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const newState = { ...recipeList };

    let response = await fetch(`${apiUrl()}/recipes`);
    let jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }

    response = await fetch(`${apiUrl()}/ingredients`);
    jsonMessage = await response.json();

    if (jsonMessage) {
      newState.ingData = jsonMessage.content.reduce(
        (
          acc: { [index: string]: { avgCost: number; unit: string } },
          val: { name: string; unit: string }
        ) => {
          acc[val.name] = { avgCost: 0.01, unit: val.unit };
          return acc;
        },
        {}
      );
      setRecipeList(newState);
    } else {
      console.log("json message failed");
    }

    response = await fetch(`${apiUrl()}/inventory`);
    jsonMessage = await response.json();
    if (jsonMessage) {
      newState.ingData = jsonMessage.content.reduce(
        (
          acc: { [index: string]: { avgCost: number; unit: string } },
          val: { name: string; avgCost: number }
        ) => {
          acc[val.name]["avgCost"] = val.avgCost;
          return acc;
        },
        newState.ingData
      );
      newState.ingData.newItem = { avgCost: 0.01, unit: "N/A" };
      setRecipeList(newState);
    } else {
      console.log("inventory json message failed");
    }
  }

  function handleNewRecipe() {
    const newState = { ...recipeList };
    newState.content.push({
      _id: `new001`,
      name: `new001`,
      ingredients: [
        {
          ingredient: {
            _id: "foo",
            name: "New Item",
            type: "N/A",
            unit: "N/A",
          },
          quantity: 0,
        },
      ],
      manHours: 0,
    });
    setRecipeList(newState);
  }

  const saveSelectedRecipe = () => {
    const saveItem = async (item: {
      _id: string;
      name: string;
      ingredients: Array<{ ingredient: Ingredient; quantity: number }>;
      manHours: number;
    }) => {
      let data;
      if (item._id.includes("new")) {
        data = await postOrPutData(`${apiUrl()}/recipes`, {
          name: item.name,
          ingredients: item.ingredients,
          manHours: item.manHours,
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/recipes/${item._id}`,
          {
            name: item.name,
            ingredients: item.ingredients,
            manHours: item.manHours,
          },
          "PUT"
        );
      }
      if (data) console.log(JSON.stringify(data));
      setRecipeList({ ...recipeList, alertMessage: data.message });
      setTimeout(() => {
        setRecipeList({ ...recipeList, alertMessage: undefined });
      }, 3000);
    };

    const foundItem = recipeList.content.find(
      (i) => i._id === recipeList.selectedId
    );
    if (!foundItem) return;
    saveItem(foundItem);
  };

  const handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...recipeList };
    newState.selectedId = event.target.value;
    setRecipeList(newState);
  };

  const handleChangeRecipe = (
    event: React.ChangeEvent<HTMLSelectElement>,
    idx: number
  ) => {
    console.log(event.target.value);
    const newState = { ...recipeList };

    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (!foundItem) return;
    if (event.target.name === "manHours") {
      foundItem["manHours"] = Number(event.target.value);
    }
    if (event.target.name === "recipeName") {
      foundItem["name"] = event.target.value;
    } else if (event.target.name === "quantity")
      foundItem.ingredients[idx].quantity = Number(event.target.value);
    else if (event.target.name === "name")
      foundItem.ingredients[idx].ingredient.name = event.target.value;
    setRecipeList(newState);
  };
  const handleRemoveRecipeLine = (idx: number) => {
    const newState = { ...recipeList };

    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (!foundItem) return;
    foundItem.ingredients = [...foundItem.ingredients];
    foundItem.ingredients.splice(idx, 1);
    setRecipeList(newState);
  };

  const handleAddRecipeLine = () => {
    const newState = { ...recipeList };
    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (!foundItem) return;
    foundItem.ingredients.push({
      quantity: 1,
      ingredient: { _id: "0", type: "type", name: "New Item", unit: "" },
    });
    setRecipeList(newState);
  };

  {
    const foundItem = recipeList.content.find(
      (el) => el._id === recipeList.selectedId
    );
    return (
      <div>
        <div id="recipeListGrid">
          <select
            className="recipeList"
            size={10}
            onChange={(e) => handleItemSelect(e)}
          >
            {recipeList.content.map((item) => (
              <option value={item._id} key={item.name}>
                {`${item.name}`}
              </option>
            ))}
          </select>
          {foundItem && (
            <RecipeForm
              item={foundItem}
              onChange={handleChangeRecipe}
              onAddLine={handleAddRecipeLine}
              onRemoveLine={handleRemoveRecipeLine}
              ingData={recipeList.ingData}
            />
          )}
          <div className="recipeButtons">
            <Button
              color="success"
              className="newRecipe"
              onClick={(e) => handleNewRecipe()}
            >
              New Recipe
            </Button>
            <Button color="warning" onClick={(e) => saveSelectedRecipe()}>
              Save Current Recipe
            </Button>
          </div>
        </div>
        {recipeList.alertMessage && (
          <Alert
            color={
              recipeList.alertMessage.includes("ERROR:") ? "danger" : "info"
            }
          >
            {recipeList.alertMessage}
          </Alert>
        )}
      </div>
    );
  }
};
