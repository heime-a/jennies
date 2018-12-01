"use strict;";
//@ts-check
import "./WorkOrderList.css";
import React, { Component } from "react";
import { Button, Input, Label } from "reactstrap";
import postOrPutData from "../common/postOrPutData";

// import postOrPutData from "../common/postOrPutData";

class WorkOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        {
          woNumber: "wo0001",
          recipe: { name: "Chocolate Macaroons" },
          startDate: "1980-01-01",
          status: "In Process",
          actualHours: 5
        }
      ],
      selectedWoNumber: undefined,
      recipeNames: ["Chocolate Macaroons", "Vanilla Macaroons"]
    };
  }
  async componentDidMount() {
    const newState = { ...this.state };

    const response = await fetch("http://127.0.0.1:3001/workorders");
    const jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }
    const ingResponse = await fetch("http://127.0.0.1:3001/recipes");
    const ingJson = await ingResponse.json();
    if (ingJson) {
      newState.recipeNames = ingJson.content.map(item => item.name);
      this.setState(newState);
    } else {
      console.log("json message failed");
    }
  }

  saveWorkOrders = e => {
    async function saveItem(item) {
      const { recipe, woNumber, startDate, status, actualHours } = item;
      if (item._id.includes("new")) {
        const data = await postOrPutData(`http://127.0.0.1:3001/workorders`, {
          recipe,
          woNumber,
          startDate,
          status,
          actualHours
        });
        if (data) console.log(JSON.stringify(data));
      } else {
        const data = await postOrPutData(
          `http://127.0.0.1:3001/workorders/${item._id}`,
          {
            recipe,
            woNumber,
            startDate,
            status,
            actualHours
          },
          "PUT"
        );
        if (data) console.log(JSON.stringify(data));
      }
    }

    const newState = { ...this.state };

    for (let item of newState.content) {
      saveItem(item);
    }
  };

  handleItemSelect = e => {
    const newState = { ...this.state };
    newState.selectedWoNumber = e.target.value;
    this.setState(newState);
  };

  handleRecipeChange = e => {
    const idx = this.state.content.findIndex(
      el => el.woNumber === this.state.selectedWoNumber
    );
    const newState = { ...this.state };
    newState.content[idx].recipe.name = e.target.value;
    this.setState(newState);
  };

  render() {
    const foundItem = this.state.content.find(
      el => el.woNumber === this.state.selectedWoNumber
    );
    return (
      <div id="workOrderList">
        <select size={10} onChange={this.handleItemSelect}>
          {this.state.content.map(({ woNumber, status, startDate }) => (
            <option value={woNumber} key={woNumber}>
              {startDate} {woNumber} {status}
            </option>
          ))}
        </select>
        {this.state.selectedWoNumber !== undefined && (
          <WorkOrderForm
            onChange={this.handleRecipeChange}
            item={foundItem}
            recipeNames={this.state.recipeNames}
          />
        )}
        <div className="buttonGroup">
          <Button color="success">New</Button>
          <Button color="warning" onClick={this.saveWorkOrders}>
            Save Modified
          </Button>
        </div>
      </div>
    );
  }
}

function WorkOrderForm({ item, recipeNames, onChange }) {
  const { recipe, status, actualHours } = item;

  const startDate = new Date(item.startDate);

  const startDateFormatted = startDate.toLocaleDateString();

  return (
    <div id="woForm">
      <Label>Recipe</Label>
      <select name="recipe.name" value={recipe.name} onChange={onChange}>
        {recipeNames.map(i => (
          <option key={i}>{i}</option>
        ))}
      </select>

      <Label>Start Date</Label>
      <Input type="text" name="startDate" value={startDateFormatted} />

      <Label>Status:</Label>
      <select name="status" value={status}>
        <option>Draft</option>
        <option>In Process</option>
        <option>Completed</option>
      </select>

      <Label>Actual Hours</Label>
      <Label>{actualHours}</Label>
    </div>
  );
}

export default WorkOrderList;
