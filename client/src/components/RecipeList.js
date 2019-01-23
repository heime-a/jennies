"use strict;";
//@ts-check
import "./RecipeList.css";
import React, { Component } from "react";
import { Button, UncontrolledAlert } from "reactstrap";
import RecipeForm from "./RecipeForm";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";

export class RecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [{ name: "Macaroons1" }, { name: "Macaroons2" }],
      selectedId: -1
    };
    //this.handleAddRecipeLine = this.handleAddRecipeLine.bind(this);
    //this.handleRemoveRecipeLine = this.handleRemoveRecipeLine.bind(this);

    console.log("Bound");
  }
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
      newState.ingData = jsonMessage.content.reduce((acc, val) => 
      { acc[val.name] = {'unit' : val.unit }; return acc }, {});
      this.setState(newState);
    } else {
      console.log("json message failed");
    }

    response = await fetch(`${apiUrl()}/inventory`);
    jsonMessage = await response.json();
    if(jsonMessage) {
      newState.ingData = jsonMessage.content.reduce((acc,val) =>
      { acc[val.name]['avgCost'] = val.avgCost; return acc}, newState.ingData );
      newState.ingData['New Item'] = { 'avgCost': 0.01, unit: 'N/A' };
      this.setState(newState);
      console.log(newState.ingData);
    } else {
      console.log('inventory json message failed')
    }
  }

  handleNewRecipe(e) {
    const newState = { ...this.state };
    newState.content.push({
      _id: `new001`,
      name: `new001`,
      ingredients: [
        {
          ingredient: { name: "New Item", type: "N/A", unit: "N/A" },
          quantity: 0
        }
      ],
      manHours: 0
    });
    this.setState(newState);
  }

  saveSelectedRecipe = e => {
    const saveItem = async item => {
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
    saveItem(foundItem);
  };

  handleItemSelect = event => {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleChangeRecipe = (event, idx) => {
    console.log(event.target.value);
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    if (event.target.name === "manHours") {
      foundItem["manHours"] = event.target.value;
    }
    if (event.target.name === "recipeName") {
      foundItem["name"] = event.target.value;
    } else if (event.target.name === "quantity")
      foundItem.ingredients[idx].quantity = event.target.value;
    else if (event.target.name === "name")
      foundItem.ingredients[idx].ingredient.name = event.target.value;
    this.setState(newState);
  };
  handleRemoveRecipeLine = (event, idx) => {
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    foundItem.ingredients = [...foundItem.ingredients];
    foundItem.ingredients.splice(idx, 1);
    this.setState(newState);
  };

  handleAddRecipeLine = event => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    foundItem.ingredients.push({
      quantity: 1,
      ingredient: { name: "New Item", unit: "" }
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
              <option value={item._id} key={item._id}>
                {`${item.name}`}
              </option>
            ))}
          </select>
          {this.state.selectedId !== -1 && (
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
              onClick={e => this.handleNewRecipe(e)}
            >
              New Recipe
            </Button>
            <Button color="warning" onClick={e => this.saveSelectedRecipe(e)}>
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
