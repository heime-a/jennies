'use strict;'
//@ts-check
import React, { Component } from "react";
import IngredientForm from "./IngredientForm";
import { Button, UncontrolledAlert } from "reactstrap";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";

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

    const response = await fetch(`${apiUrl()}/ingredients`);
    const jsonMessage = await response.json();
    if (jsonMessage) {
      this.setState({ content: jsonMessage.content });
    } else {
      console.log("json message failed");
    }
  }

  async componentWillUnmount() {
    console.log('Unmounting IngredientList' );
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

  saveSelected = event => {
    const saveItem = async item => {
      const url = `${apiUrl()}/ingredients`;
      let data;
      if (item._id.includes("new")) {
        data = await postOrPutData(`${url}`, {
          name: item.name,
          type: item.type,
          unit: item.unit
        });
      } else {
        data = await postOrPutData(
          `${url}/${item._id}`,
          { name: item.name, type: item.type, unit: item.unit },
          "PUT"
        );
      }
      if (data) console.log(JSON.stringify(data));
      this.setState({ ...this.state, alertMessage: data.message });
      setTimeout(() => { this.setState({ ...this.state, alertMessage: undefined }) }, 3000);

    };

    
    const newState = { ...this.state };
    console.log("saveSelected");
    const selectedItem = newState.content.find(el => el._id === this.state.selectedId);
    saveItem(selectedItem);
    this.setState(newState);
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
            color="warning"
            className="saveIngredient"
            onClick={e => this.saveSelected(e)}
          >
            Save Selected
          </Button>
        </div>
        {this.state.alertMessage &&
          <UncontrolledAlert color={this.state.alertMessage.includes("ERROR:") ? "danger" : "info"} >
            {this.state.alertMessage}
          </UncontrolledAlert>}

      </div>
    );
  }
}
