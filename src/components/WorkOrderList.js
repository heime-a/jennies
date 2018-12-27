"use strict;";
//@ts-check
import "./WorkOrderList.css";
import React, { Component } from "react";
import { Button, Input, Label, UncontrolledAlert } from "reactstrap";
import postOrPutData from "../common/postOrPutData";

/* Alert color="warning">
This is a warning alert — check it out!
</Alert>
<Alert color="info">
This is a info alert — check it out!
</Alert> */


class WorkOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        {
          _id : "test001",
          woNumber: "wo0001",
          recipe: { name: "Chocolate Macaroons" },
          startDate: "1980-01-01",
          status: "In Process",
          actualHours: 5,
          actualYield: 100,
        }
      ],
      selectedWoNumber: undefined,
      alertMessage: undefined,
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

  saveWorkOrder = e => {
    const saveItem  = async item => {
      const { recipe, woNumber, startDate, status, actualHours, actualYield } = item;
      let data;
      if (item._id.includes("new")) {
          data = await postOrPutData(`http://127.0.0.1:3001/workorders`, {
          recipe,
          woNumber : woNumber.replace(/new/,'wo'),
          startDate,
          status,
          actualHours,
          actualYield
        });  
      } else {
          data = await postOrPutData(
          `http://127.0.0.1:3001/workorders/${item._id}`,
          {
            recipe,
            woNumber,
            startDate,
            status,
            actualHours,
            actualYield,
          },
          "PUT"
        );
      }
      if (data) console.log(JSON.stringify(data));
      this.setState({ ...this.state, alertMessage: data.message });
      setTimeout(() => { this.setState({ ...this.state, alertMessage: undefined }) }, 3000);
    }

    const selectedItem = this.state.content.find(i=> this.state.selectedWoNumber === i.woNumber);
    saveItem(selectedItem);
  };

  handleNewWorkOrder = e => {

    const getUniqWo = (woNums) => {
      const maxWo = Math.max(...woNums.map(i=>i.replace(/\D*/,"")));
      return `new${maxWo+1}`;
    }
    
    const newState = {...this.state};
    const newWoNumber = getUniqWo(this.state.content.map(i=>i.woNumber));
    newState.content.push({
      _id: newWoNumber,
      woNumber: newWoNumber,
      recipe: { name: "New Recipe" },
      startDate: "1980-01-01",
      status: "Draft",
      actualHours: 8,
      actualYield: 100,
    });
    this.setState(newState);
  }

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
    return <div>
        <div id="workOrderList">
          <select size={10} onChange={this.handleItemSelect}>
            {this.state.content.map(({ woNumber, status, startDate }) => (
              <option value={woNumber} key={woNumber}>
                {startDate} {woNumber} {status}
              </option>
            ))}
          </select>
          {this.state.selectedWoNumber !== undefined && <WorkOrderForm onChange={this.handleRecipeChange} item={foundItem} recipeNames={this.state.recipeNames} />}
          <div>
            <Button color="success" onClick={this.handleNewWorkOrder}>
              New
            </Button>
            <Button color="warning" onClick={this.saveWorkOrder}>
              Save Current
            </Button>
          </div>
        </div>
        {this.state.alertMessage && 
          <UncontrolledAlert color={this.state.alertMessage.includes("ERROR:") ? "danger" : "info"} >
            {this.state.alertMessage}
          </UncontrolledAlert>}
      </div>;
  }
}

function WorkOrderForm({ item, recipeNames, onChange }) {
  const { recipe, status, actualHours, actualYield } = item;

  const startDate = new Date(item.startDate);

  const startDateFormatted = startDate.toLocaleDateString();

  return <div id="woForm">
      <Label>Recipe</Label>
      <select name="recipe.name" value={recipe.name} onChange={onChange}>
        {recipeNames.map(i => <option key={i}>{i}</option>)}
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
      <Label>Actual Yield</Label>
      <Label>{actualYield}</Label>
    </div>;
}

export default WorkOrderList;
