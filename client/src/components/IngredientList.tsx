import React, { Component } from "react";
import { Button, UncontrolledAlert } from "reactstrap";
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
interface IngredientListState {
  content: Array<Ingredient>;
  selectedId: string;
  newItemsIndex: number;
  alertMessage?: string;
}
export class IngredientList extends Component {
  state: IngredientListState = {
    content: [{ _id: "1", name: "", type: "", unit: "" }],
    selectedId: "",
    newItemsIndex: 0,
    alertMessage: undefined
  };

  async componentDidMount() {
    const response = await fetch(`${apiUrl()}/ingredients`);
    const jsonMessage = await response.json();
    if (jsonMessage) {
      this.setState({ content: jsonMessage.content });
    } else {
      console.log("json message failed");
    }
  }

  handleItemSelect = (event: { target: { value: string } }) => {
    //console.log(event.target.attributes.itemid.value);
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleFormChange = (event: React.ChangeEvent<HTMLInputElement>, item: Ingredient) => {
    const change: IngredientListState = { ...this.state };
    const idx = this.state.content.indexOf(item);
    change.content[idx][event.target.name] = event.target.value;
    this.setState(change);
  };

  saveSelected = () => {
    const saveItem = async (item?: Ingredient) => {
      const url = `${apiUrl()}/ingredients`;
      let data;

      if (!item) return;

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
      setTimeout(() => {
        this.setState({ ...this.state, alertMessage: undefined });
      }, 3000);
    };

    const newState: IngredientListState = { ...this.state };
    console.log("saveSelected");
    const selectedItem = newState.content.find(
      el => el._id === this.state.selectedId
    );
    saveItem(selectedItem);
    this.setState(newState);
  };

  newIngredient = () => {
    const state = { ...this.state };
    state.content.push({
      _id: `new${state.newItemsIndex}`,
      name: "New Ingredient Here",
      type: "None",
      unit: "None",
    });
    state.newItemsIndex++;
    this.setState(state);
  };

  render() {
    const foundItem = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    return (
      <div className="ingredientGrid">
        <select
          size={10}
          className="ingredientList"
          onChange={this.handleItemSelect}
        >
          {this.state.content.map(item => (
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
            onChange={e => this.handleFormChange(e, foundItem)}
          />
        )}
        <div className="ingButtons">
          <Button
            color="success"
            className="newIngredient"
            onClick={() => this.newIngredient()}
          >
            New Ingredient
          </Button>
          <Button
            color="warning"
            className="saveIngredient"
            onClick={() => this.saveSelected()}
          >
            Save Selected
          </Button>
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
