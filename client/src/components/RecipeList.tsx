"use strict;";
//@ts-check
import "./RecipeList.css";
import React, { Component } from "react";
import { Button, UncontrolledAlert } from "reactstrap";
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
export class RecipeList extends Component {
  state: RecipeListState = {
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
              unit: "N/A"
            },
            quantity: 0
          }
        ]
      }
    ],
    selectedId: "",
    ingData: {
      newItem: {
        unit: "Oz.",
        avgCost: 0.01
      }
    },
    alertMessage: ""
  };

  async componentDidMount() {
    const newState = { ...this.state };

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
      this.setState(newState);
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
      this.setState(newState);
    } else {
      console.log("inventory json message failed");
    }
  }

  handleNewRecipe() {
    const newState = { ...this.state };
    newState.content.push({
      _id: `new001`,
      name: `new001`,
      ingredients: [
        {
          ingredient: {
            _id: "foo",
            name: "New Item",
            type: "N/A",
            unit: "N/A"
          },
          quantity: 0
        }
      ],
      manHours: 0
    });
    this.setState(newState);
  }

  saveSelectedRecipe = () => {
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
          manHours: item.manHours
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/recipes/${item._id}`,
          {
            name: item.name,
            ingredients: item.ingredients,
            manHours: item.manHours
          },
          "PUT"
        );
      }
      if (data) console.log(JSON.stringify(data));
      this.setState({ ...this.state, alertMessage: data.message });
      setTimeout(() => {
        this.setState({ ...this.state, alertMessage: undefined });
      }, 3000);
    };

    const foundItem = this.state.content.find(
      i => i._id === this.state.selectedId
    );
    if (!foundItem) return;
    saveItem(foundItem);
  };

  handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleChangeRecipe = (
    event: React.ChangeEvent<HTMLSelectElement>,
    idx: number
  ) => {
    console.log(event.target.value);
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
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
    this.setState(newState);
  };
  handleRemoveRecipeLine = (idx: number) => {
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    if (!foundItem) return;
    foundItem.ingredients = [...foundItem.ingredients];
    foundItem.ingredients.splice(idx, 1);
    this.setState(newState);
  };

  handleAddRecipeLine = () => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    if (!foundItem) return;
    foundItem.ingredients.push({
      quantity: 1,
      ingredient: { _id: "0", type: "type", name: "New Item", unit: "" }
    });
    this.setState(newState);
  };

  render() {
    const foundItem = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    return (
      <div>
        <div id="recipeListGrid">
          <select
            className="recipeList"
            size={10}
            onChange={e => this.handleItemSelect(e)}
          >
            {this.state.content.map(item => (
              <option value={item._id} key={item.name}>
                {`${item.name}`}
              </option>
            ))}
          </select>
          {foundItem && (
            <RecipeForm
              item={foundItem}
              onChange={this.handleChangeRecipe}
              onAddLine={this.handleAddRecipeLine}
              onRemoveLine={this.handleRemoveRecipeLine}
              ingData={this.state.ingData}
            />
          )}
          <div className="recipeButtons">
            <Button
              color="success"
              className="newRecipe"
              onClick={e => this.handleNewRecipe()}
            >
              New Recipe
            </Button>
            <Button color="warning" onClick={e => this.saveSelectedRecipe()}>
              Save Current Recipe
            </Button>
          </div>
        </div>
        {this.state.alertMessage && (
          <UncontrolledAlert
            color={
              this.state.alertMessage.includes("ERROR:") ? "danger" : "info"
            }
          >
            {this.state.alertMessage}
          </UncontrolledAlert>
        )}
      </div>
    );
  }
}
