//@ts-check
import "./WorkOrderList.css";
import React, { Component } from "react";
import { Button, Input, Label, Alert, Spinner } from "reactstrap";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";

interface Workorder {
  [index: string]: string | number | { name: string };
  _id: string;
  recipe: { name: string };
  woNumber: string;
  startDate: string;
  status: string;
  actualHours: number;
  actualYield: number;
}
interface WorkOrderListState {
  loading: Boolean;
  content: Array<Workorder>;
  selectedWoNumber: string;
  alertMessage: string;
  recipeNames: Array<string>;
}
class WorkOrderList extends Component {
  state: WorkOrderListState = {
    loading: true,
    content: [
      {
        _id: "test001",
        woNumber: "wo0001",
        recipe: { name: "Chocolate Macaroons" },
        startDate: "1980-01-01",
        status: "In Process",
        actualHours: 5,
        actualYield: 100,
      },
    ],
    selectedWoNumber: "",
    alertMessage: "",
    recipeNames: ["Chocolate Macaroons", "Vanilla Macaroons"],
  };

  async componentDidMount() {
    const newState = { ...this.state };

    const response = await fetch(`${apiUrl()}/workorders`);
    const jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }
    const ingResponse = await fetch(`${apiUrl()}/recipes`);
    const ingJson = await ingResponse.json();
    if (ingJson) {
      newState.recipeNames = ingJson.content.map(
        (item: { name: string }) => item.name
      );
      newState.loading = false;
      this.setState(newState);
    } else {
      console.log("json message failed");
    }
  }

  saveWorkOrder = () => {
    const saveItem = async ({
      _id,
      recipe,
      woNumber,
      startDate,
      status,
      actualHours,
      actualYield,
    }: Workorder) => {
      let data;
      if (_id.includes("new")) {
        data = await postOrPutData(`${apiUrl()}/workorders`, {
          recipe,
          woNumber: woNumber.replace(/new/, "wo"),
          startDate,
          status,
          actualHours,
          actualYield,
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/workorders/${_id}`,
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
      setTimeout(() => {
        this.setState({ ...this.state, alertMessage: undefined });
      }, 3000);
    };

    const selectedItem = this.state.content.find(
      (i) => this.state.selectedWoNumber === i.woNumber
    );
    if (!selectedItem) return null;
    saveItem(selectedItem);
  };

  handleNewWorkOrder = () => {
    const getUniqWo = (woNums: Array<string>) => {
      const maxWo = Math.max(
        ...woNums.map((i: string) => Number(i.replace(/\D*/, "")))
      );
      return `new${maxWo + 1}`;
    };

    const newState = { ...this.state };
    const newWoNumber = getUniqWo(this.state.content.map((i) => i.woNumber));
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
  };

  handleItemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...this.state };
    newState.selectedWoNumber = e.target.value;
    this.setState(newState);
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = this.state.content.findIndex(
      (el) => el.woNumber === this.state.selectedWoNumber
    );
    const newState = { ...this.state };
    if (e.target.name === "recipe.name")
      newState.content[idx].recipe.name = e.target.value;
    newState.content[idx][e.target.name] = e.target.value;
    this.setState(newState);
  };

  render() {
    const foundItem = this.state.content.find(
      (el) => el.woNumber === this.state.selectedWoNumber
    );
    if (this.state.loading)
      return (<div id="workOrderList"><Spinner color="secondary" style={{ width: '10rem', height: '10rem' }} type="grow" /></div>)
    else
      return (
        <div>
          <div id="workOrderList">
            <select size={10} onChange={this.handleItemSelect}>
              {this.state.content.map(({ woNumber, status, startDate }) => (
                <option value={woNumber} key={woNumber}>
                  {startDate} {woNumber} {status}
                </option>
              ))}
            </select>
            {foundItem && (
              <WorkOrderForm
                onChange={this.handleChange}
                item={foundItem}
                recipeNames={this.state.recipeNames}
              />
            )}
            <div>
              <Button color="success" onClick={this.handleNewWorkOrder}>
                New
            </Button>
              <Button color="warning" onClick={this.saveWorkOrder}>
                Save Current
            </Button>
            </div>
          </div>
          {this.state.alertMessage && (
            <Alert
              color={
                this.state.alertMessage.includes("ERROR:") ? "danger" : "info"
              }
            >
              {this.state.alertMessage}
            </Alert>
          )}
        </div>
      );
  }
}

function WorkOrderForm({
  item,
  recipeNames,
  onChange,
}: {
  item: Workorder;
  recipeNames: Array<string>;
  onChange: any;
}) {
  const { recipe, status, actualHours, actualYield, startDate } = item;

  //TODO: Work order date default and date edit
  //TODO: validate start date here
  let startDateFormatted;
  if (startDate.length === 10) {
    const startDate = new Date(item.startDate);
    startDateFormatted = startDate.toLocaleDateString();
  } else {
    startDateFormatted = startDate;
  }

  return (
    <div id="woForm">
      <Label>Recipe</Label>
      <select name="recipe.name" value={recipe.name} onChange={onChange}>
        {recipeNames.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>

      <Label>Start Date</Label>
      <Input
        type="text"
        name="startDate"
        value={startDateFormatted}
        onChange={onChange}
      />

      <Label>Status:</Label>
      <select name="status" value={status} onChange={onChange}>
        <option>Draft</option>
        <option>In Process</option>
        <option>Completed</option>
      </select>

      <Label>Actual Hours</Label>
      <Input
        type="text"
        name="actualHours"
        value={actualHours}
        onChange={onChange}
      />
      <Label>Actual Yield</Label>
      <Input
        type="text"
        name="actualYield"
        value={actualYield}
        onChange={onChange}
      />
    </div>
  );
}

export default WorkOrderList;
