"use strict;";
import "./PurchaseOrderList.css";
import React, { Component } from "react";
import { Button, Alert, Spinner } from "reactstrap";
import PurchaseOrderForm from "./PurchaseOrderForm";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";
import { Ingredient } from "./IngredientList";


//TODO: printing layout for purchaseorders  started
export interface LineItem {
  ingredient: Ingredient;
  quantity: number;
  unitCost: number;
}
export interface Po {
  _id: string;
  poNumber: string;
  ingredients: Array<LineItem>;
  supplier: {
    name: string;
    address: string;
  };
}
interface PurchaseOrderListState {
  loading: Boolean;
  content: Array<Po>;
  selectedId: string;
  ingData: {
    [index: string]: string;
  };
  alertMessage?: string;
}
class PurchaseOrderList extends Component {
  state: PurchaseOrderListState = {
    loading: true,
    content: [
      {
        _id: "1",
        poNumber: "1",
        supplier: { name: "Test1", address: "address" },
        ingredients: [
          {
            ingredient: { _id: "0", name: "name", type: "type", unit: "unit" },
            quantity: 0,
            unitCost: 0,
          },
        ],
      },
      {
        _id: "2",
        poNumber: "2",
        supplier: { name: "Test1", address: "address" },
        ingredients: [
          {
            ingredient: { _id: "0", name: "name", type: "type", unit: "unit" },
            quantity: 0,
            unitCost: 0,
          },
        ],
      },
    ],
    selectedId: "",
    ingData: {
      sugar: "ounces",
    },
  };

  async componentDidMount() {
    const newState: PurchaseOrderListState = { ...this.state };

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
      newState.ingData = jsonMessage.content.reduce(
        (
          acc: { [index: string]: string },
          val: { name: string; unit: string }
        ) => {
          acc[val.name] = val.unit;
          return acc;
        },
        {}
      );
      newState.loading = false;
      this.setState(newState);
    } else {
      console.log("json message failed");
    }
  }

  newPurchaseOrder() {
    const getUniqPo = (poNums: Array<string>) => {
      const maxPo = Math.max(
        ...poNums.map((i) => Number(i.replace(/\D*/, "")))
      );
      return `new${maxPo + 1}`;
    };

    const newState = { ...this.state };
    const newPoNumber = getUniqPo(
      this.state.content.map((i) => i.poNumber.toString())
    );

    newState.content.push({
      _id: newPoNumber,
      poNumber: newPoNumber,
      ingredients: [
        {
          ingredient: {
            _id: "0",
            name: "New Ingredient",
            type: "Type",
            unit: "Oz.",
          },
          quantity: 0,
          unitCost: 1,
        },
      ],
      supplier: { name: "Test2", address: "address" },
    });
    this.setState(newState);
  }

  saveSelectedPO = () => {
    const saveItem = async (item?: Po) => {
      let data;
      if (!item) return;
      if (item._id.includes("new")) {
        data = await postOrPutData(`${apiUrl()}/purchaseOrders`, {
          poNumber: item.poNumber,
          ingredients: item.ingredients,
          supplier: item.supplier,
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/purchaseOrders/${item._id}`,
          {
            poNumber: item.poNumber,
            ingredients: item.ingredients,
            supplier: item.supplier,
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
      (i) => this.state.selectedId === i._id
    );
    saveItem(foundItem);
  };

  handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleChangePO = (
    event: React.ChangeEvent<HTMLSelectElement>,
    idx: number
  ) => {
    console.log(event.target.value);
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (foundItem) {
      if (event.target.name === "quantity")
        foundItem.ingredients[idx].quantity = Number(event.target.value);
      if (event.target.name === "name")
        foundItem.ingredients[idx].ingredient.name = event.target.value;
      if (event.target.name === "unitCost")
        foundItem.ingredients[idx].unitCost = Number(event.target.value);
      this.setState(newState);
    }
  };
  handleRemovePoLine = (idx: number) => {
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (foundItem) {
      foundItem.ingredients = [...foundItem.ingredients];
      foundItem.ingredients.splice(idx, 1);
      this.setState(newState);
    }
  };

  handleAddPoLine = () => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      (el) => el._id === newState.selectedId
    );
    if (foundItem) {
      foundItem.ingredients.push({
        quantity: 1,
        unitCost: 0.01,
        ingredient: { _id: "", name: "New Item", type: "type", unit: "Oz" },
      });
      this.setState(newState);
    }
  };

  render() {
    const foundItem = this.state.content.find(
      (el) => el._id === this.state.selectedId
    );
    if (this.state.loading)
      return (<div id="poListGrid"><Spinner style={{ width: '10rem', height: '10rem' }} color="secondary" /></div>)
    else
      return (
        <div>
          <div id="poListGrid">
            <select
              size={10}
              className="purchaseOrderList delete"
              onChange={(e) => this.handleItemSelect(e)}
            >
              {this.state.content.map((item) => (
                <option value={item._id} key={item.poNumber}>
                  {`${item.poNumber} ${item.supplier.name}`}
                </option>
              ))}
            </select>
            {foundItem && (
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
                onClick={(e) => this.newPurchaseOrder()}
              >
                New Purchase Order
            </Button>
              <Button color="warning" onClick={this.saveSelectedPO}>
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

export default PurchaseOrderList;
