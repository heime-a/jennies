"use strict;";
import "./PurchaseOrderList.css";
import React, { Component } from "react";
import { Button, UncontrolledAlert } from "reactstrap";
import PurchaseOrderForm from "./PurchaseOrderForm";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";

//TODO: printing layout for purchaseorders  started

class PurchaseOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        { poNumber: 1, supplier: { name: "Test1" } },
        { poNumber: 2, supplier: { name: "Test2" } }
      ],
      selectedId: -1
    };
  }
  async componentDidMount() {
    const newState = { ...this.state };

    let response = await fetch(`${apiUrl()}/purchaseOrders`);
    let jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }

    response = await fetch(`${apiUrl()}/ingredients`);
    jsonMessage = await response.json();
    if (jsonMessage) {
      newState.ingData = jsonMessage.content.reduce((acc, val) => {
        acc[val.name] = val.unit;
        return acc;
      }, {});
      this.setState(newState);
    } else {
      console.log("json message failed");
    }
  }

  newPurchaseOrder(e) {
    const newState = { ...this.state };
    newState.content.push({
      _id: `new001`,
      poNumber: `new001`,
      ingredients: [
        {
          ingredient: { name: "New Ingredient", type: "Type", unit: "Oz." },
          quantity: 0
        }
      ],
      supplier: { name: "Test2" }
    });
    this.setState(newState);
  }

  saveSelectedPO = e => {
    const saveItem = async item => {
      let data;
      if (item._id.includes("new")) {
        data = await postOrPutData(`${apiUrl()}/purchaseOrders`, {
          poNumber: item.poNumber,
          ingredients: item.ingredients,
          supplier: item.supplier
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/purchaseOrders/${item._id}`,
          {
            poNumber: item.poNumber,
            ingredients: item.ingredients,
            supplier: item.supplier
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
      i => this.state.selectedId === i._id
    );
    saveItem(foundItem);
  };

  handleItemSelect = event => {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleChangePO = (event, idx) => {
    console.log(event.target.value);
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    if (event.target.name === "quantity")
      foundItem.ingredients[idx].quantity = event.target.value;
    if (event.target.name === "name")
      foundItem.ingredients[idx].ingredient.name = event.target.value;
    if (event.target.name === "unitCost")
      foundItem.ingredients[idx].unitCost = event.target.value;

    console.log(foundItem.ingredients[idx].ingredient.unitCost);
    this.setState(newState);
  };
  handleRemovePoLine = (event, idx) => {
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    foundItem.ingredients = [...foundItem.ingredients];
    foundItem.ingredients.splice(idx, 1);
    this.setState(newState);
  };

  handleAddPoLine = event => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    foundItem.ingredients.push({
      quantity: 1,
      ingredient: { name: "New Item", unit: "", unitCost: 0.01 }
    });
    this.setState(newState);
  };

  render() {
    const foundItem = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    return (
      <div>
        <div id="poListGrid">
          <select
            size={10}
            className="purchaseOrderList delete"
            onChange={e => this.handleItemSelect(e)}
          >
            {this.state.content.map(item => (
              <option value={item._id} key={item.poNumber}>
                {`${item.poNumber} ${item.supplier.name}`}
              </option>
            ))}
          </select>
          {this.state.selectedId !== -1 && (
            <PurchaseOrderForm
              item={foundItem}
              onChange={this.handleChangePO}
              onAddLine={this.handleAddPoLine}
              onRemoveLine={this.handleRemovePoLine}
              ingData={this.state.ingData}
            />
          )}
          <div className="poButtons delete">
            <Button
              color="success"
              className="newPO"
              onClick={e => this.newPurchaseOrder(e)}
            >
              New Purchase Order
            </Button>
            <Button color="warning" onClick={this.saveSelectedPO}>
              Save Current
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

export default PurchaseOrderList;
