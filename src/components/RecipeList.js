'use strict;'
//@ts-check
import "./RecipeList.css"
import React, { Component } from "react";
import { Button } from "reactstrap";
import RecipeForm from "./RecipeForm";
import postOrPutData from "../common/postOrPutData";

export class RecipeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [
                { name: "Macaroons1" },
                { name: "Macaroons2" }
            ],
            selectedId: -1
        };
        //this.handleAddRecipeLine = this.handleAddRecipeLine.bind(this);
        //this.handleRemoveRecipeLine = this.handleRemoveRecipeLine.bind(this);

        console.log("Bound");
    }
    async componentDidMount() {
        const newState = { ...this.state };

        let response = await fetch("http://127.0.0.1:3001/recipes");
        let jsonMessage = await response.json();
        if (jsonMessage) {
            newState.content = jsonMessage.content;
        } else {
            console.log("json message failed");
        }

        response = await fetch("http://127.0.0.1:3001/ingredients");
        jsonMessage = await response.json();
        if (jsonMessage) {
            newState.ingNames = jsonMessage.content.map(item => item.name);
            this.setState(newState);
        } else {
            console.log("json message failed");
        }

    }

    handleNewRecipe(e) {
        const newState = { ...this.state };
        newState.content.push({
            _id: `new001`,
            name: `new001`,
            ingredients: [
                {
                    ingredient: { name: "New Ingredient", type: "Type", unit: "Oz." },
                    quantity: 0
                }
            ],
            manHours: 0,
        });
        this.setState(newState);
    }

    saveModifiedRecipes = (e) => {
        async function saveItem(item) {
            if (item._id.includes("new")) {
                const data = await postOrPutData(`http://127.0.0.1:3001/recipes`, {
                    name: item.name,
                    ingredients: item.ingredients,
                    manHours: item.manHours
                });
                if (data) console.log(JSON.stringify(data));
            } else {
                const data = await postOrPutData(`http://127.0.0.1:3001/recipes/${item._id}`, {
                    name: item.name,
                    ingredients: item.ingredients,
                    manHours: item.manHours
                }, "PUT");
                if (data) console.log(JSON.stringify(data));

            }
        }

        const newState = { ...this.state };

        for (let item of newState.content) {
            saveItem(item);
        }
    }

    handleItemSelect = (event) => {
        const newState = { ...this.state };
        newState.selectedId = event.target.value;
        this.setState(newState);
    }

    handleChangeRecipe = (event, idx) => {
        console.log(event.target.value);
        const newState = { ...this.state };

        const foundItem = newState.content.find(
            el => el._id === newState.selectedId
        );

        if (event.target.name === "manHours") {
             foundItem["manHours"]= event.target.value;
        }
        if(event.target.name === "recipeName") {
            foundItem["name"] = event.target.value;
        }
        else if (event.target.name === "quantity")
            foundItem.ingredients[idx].quantity = event.target.value;
        else if (event.target.name === "name")
            foundItem.ingredients[idx].ingredient.name = event.target.value;
        this.setState(newState);
    }
    handleRemoveRecipeLine = (event, idx) => {
        const newState = { ...this.state };

        const foundItem = newState.content.find(
            el => el._id === newState.selectedId
        );

        foundItem.ingredients = [...foundItem.ingredients];
        foundItem.ingredients.splice(idx, 1);
        this.setState(newState);
    }


    handleAddRecipeLine = (event) => {
        const newState = { ...this.state };
        const foundItem = newState.content.find(
            el => el._id === newState.selectedId
        );

        foundItem.ingredients.push({
            quantity: 1,
            ingredient: { name: "New Item", unit: "" }
        });
        this.setState(newState);
    }

    render() {
        const foundItem = this.state.content.find(
            el => el._id === this.state.selectedId
        );
        return <>
            <div id="recipeListGrid">
              <select className="recipeList"
               size={10} 
               onChange={e => this.handleItemSelect(e)}>
                {this.state.content.map(item => (
                  <option value={item._id} key={item._id}>
                    {`${item.name}`}
                  </option>
                ))}
              </select>
              {this.state.selectedId !== -1 && <RecipeForm item={foundItem} onChange={this.handleChangeRecipe} onAddLine={this.handleAddRecipeLine} onRemoveLine={this.handleRemoveRecipeLine} ingNames={this.state.ingNames} />}
              <div className="recipeButtons">
                <Button color="success" className="newRecipe" onClick={e => this.handleNewRecipe(e)}>
                  New Recipe
                </Button>
                <Button color="warning" onClick={e => this.saveModifiedRecipes(e)}>
                  Save Modified Recipes
                </Button>
              </div>
            </div>
          </>;
    }
}
