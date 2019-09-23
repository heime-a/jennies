"use strict;";
import "./CustomerOrderList.css";
import React, { Component } from "react";
import { Button, UncontrolledAlert } from "reactstrap";
import CustomerOrderForm from "./CustomerOrderForm";
import postOrPutData from "../common/postOrPutData";
import apiUrl from "../common/apiurl.js";

//TODO: Customer order unique transaction numbers
//TODO: print layout for customer orders  started
export interface Order {
  _id: string;
  coNumber: string;
  items: {
    name: string;
    quantity: number;
    unitCost: number;
  }[];
  customer: {
    name: string;
    address: string;
  };
}
interface CustomerOrderListState {
  content: {
    _id: string;
    coNumber: string;
    items: {
      name: string;
      quantity: number;
      unitCost: number;
    }[];
    customer: {
      name: string;
      address: string;
    };
  }[];
  selectedId: string;
  productNames: string[];
  alertMessage: string;
}
class CustomerOrderList extends Component {
  state: CustomerOrderListState = {
    content: [
      {
        _id: "1",
        coNumber: "1",
        items: [
          {
            name: "New LineItem",
            quantity: 0,
            unitCost: 2.99
          }
        ],
        customer: { name: "Test2", address: "test3" }
      }
    ],
    selectedId: "",
    productNames: ["macaroon", "cholate"],
    alertMessage: ""
  };

  async componentDidMount() {
    const newState = { ...this.state };

    let response = await fetch(`${apiUrl()}/customerOrders`);
    let jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }
    response = await fetch(`${apiUrl()}/recipes`);
    jsonMessage = await response.json();
    if (jsonMessage) {
      newState.productNames = jsonMessage.content.map(
        (item: { name: string }) => item.name
      );
      this.setState(newState);
    } else {
      console.log("json message failed");
    }
  }

  newCustomerOrder() {
    const newState = { ...this.state };
    newState.content.push({
      _id: `new001`,
      coNumber: `new001`,
      items: [
        {
          name: "New LineItem",
          quantity: 0,
          unitCost: 2.99
        }
      ],
      customer: { name: "Test2", address: "test3" }
    });
    this.setState(newState);
  }

  saveSelectedCO = () => {
    const saveItem = async (order: Order) => {
      let data;
      if (order._id.includes("new")) {
        data = await postOrPutData(`${apiUrl()}/customerOrders`, {
          coNumber: order.coNumber,
          items: order.items,
          customer: order.customer
        });
      } else {
        data = await postOrPutData(
          `${apiUrl()}/customerOrders/${order._id}`,
          {
            coNumber: order.coNumber,
            items: order.items,
            customer: order.customer
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
    if (!foundItem) return;
    saveItem(foundItem);
  };

  handleItemSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  };

  handleChangeCO = (
    event: React.ChangeEvent<HTMLSelectElement>,
    idx: number
  ) => {
    console.log(event.target.value);
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    if (!foundItem) return;
    if (event.target.name === "quantity")
      foundItem.items[idx].quantity = Number(event.target.value);
    if (event.target.name === "name")
      foundItem.items[idx].name = event.target.value;
    if (event.target.name === "unitCost")
      foundItem.items[idx].unitCost = Number(event.target.value);

    this.setState(newState);
  };

  handleRemoveCoLine = (idx: number) => {
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    if (!foundItem) return;

    foundItem.items = [...foundItem.items];
    foundItem.items.splice(idx, 1);
    this.setState(newState);
  };

  handleAddCoLine = () => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    if (!foundItem) return;
    foundItem.items.push({
      name: "New Item",
      quantity: 1,
      unitCost: 0.01
    });
    this.setState(newState);
  };

  render() {
    const foundOrder = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    return (
      <div>
        <div id="coListGrid">
          <select
            size={10}
            className="customerOrderList delete"
            onChange={e => this.handleItemSelect(e)}
          >
            {this.state.content.map((order, idx) => (
              <option value={order._id} key={idx}>
                {`${order.coNumber} ${order.customer.name}`}
              </option>
            ))}
          </select>
          {foundOrder && (
            <CustomerOrderForm
              order={foundOrder}
              onChange={this.handleChangeCO}
              onAddLine={this.handleAddCoLine}
              onRemoveLine={this.handleRemoveCoLine}
              productNames={this.state.productNames}
            />
          )}
          <div className="coButtons delete">
            <Button
              color="success"
              className="newPO"
              onClick={e => this.newCustomerOrder()}
            >
              New Customer Order
            </Button>
            <Button
              className="delete"
              color="warning"
              onClick={this.saveSelectedCO}
            >
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

export default CustomerOrderList;
