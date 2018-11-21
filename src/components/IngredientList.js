'use strict;'
//@ts-check
import React, { Component } from "react";
import IngredientForm from "./IngredientForm";
import { Button } from "reactstrap";
import postOrPutData from "../common/postOrPutData";

export class IngredientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        { _id: 1, name: "", type: "", unit: "", needSave: false },
        { _id: 2 },
        { _id: 3 }
      ],
      selectedId: -1,
      newItemsIndex: 0
    };
  }
  async componentDidMount() {
    const response = await fetch("http://127.0.0.1:3001/ingredients");
    const jsonMessage = await response.json();
    if (jsonMessage) {
      this.setState({ content: jsonMessage.content });
    } else {
      console.log("json message failed");
    }
  }
  handleItemSelect = event => {
    //console.log(event.target.attributes.itemid.value);
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleFormChange = (event, item) => {
    const change = { ...this.state };
    const idx = this.state.content.indexOf(item);
    change.content[idx][event.target.name] = event.target.value;
    change.content[idx].needSave = true;
    this.setState(change);
  };

  saveModified = event => {
    const saveItem = async item => {
      const url = "http://127.0.0.1:3001/ingredients";
      if (item._id.includes("new")) {
        const data = await postOrPutData(`${url}`, {
          name: item.name,
          type: item.type,
          unit: item.unit
        });

        if (data) console.log(JSON.stringify(data));
      } else {
        const data = await postOrPutData(
          `${url}/${item._id}`,
          { name: item.name, type: item.type, unit: item.unit },
          "PUT"
        );
        if (data) console.log(JSON.stringify(data));
      }
      //TODO : create alert area to show that item got successfully saved
    };

    
    const change = { ...this.state };
    console.log("savemodified");
    change.content.map(item => {
      if (item.needSave) {
        saveItem(item);
        item.needSave = false;
      }
      return item;
    });
    this.setState(change);
  };

  newIngredient = event => {
    const state = { ...this.state };
    state.content.push({
      _id: `new${state.newItemsIndex}`,
      name: "New Ingredient Here",
      type: "None",
      unit: "None",
      needSave: true
    });
    state.newItemsIndex++;
    this.setState(state);
  };

  render() {
    const foundItem = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    console.log("render:", foundItem, this.state.selectedId);
    return (
      <div className="ingredientGrid">
        <select
          size={10}
          className="ingredientList"
          onChange={this.handleItemSelect}
        >
          {this.state.content.map(item => (
            <option className="listItem" value={item._id} key={item._id}>{`${
              item.name
            } ${item.type} ${item.unit}`}</option>
          ))}
        </select>
        {this.state.selectedId !== -1 && (
          <IngredientForm
            item={foundItem}
            onChange={e => this.handleFormChange(e, foundItem)}
          />
        )}
        <div className="ingButtons">
          <Button
            color="success"
            className="newIngredient"
            onClick={e => this.newIngredient(e)}
          >
            New Ingredient
          </Button>
          <Button
            color="success"
            className="saveIngredient"
            onClick={e => this.saveModified(e)}
          >
            Save Modified
          </Button>
        </div>
      </div>
    );
  }
}
