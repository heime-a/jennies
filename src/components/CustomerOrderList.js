'use strict;'
import "./CustomerOrderList.css"
import React, { Component } from "react";
import { Button , UncontrolledAlert} from "reactstrap";
import CustomerOrderForm from "./CustomerOrderForm";
import postOrPutData from "../common/postOrPutData";



 class CustomerOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        { _id: 1,  coNumber: 1, customer: { name: "Test1",address: 'address' } },
        { _id: 2, coNumber: 2, customer: { name: "Test2",address: 'address' } }
      ],
      selectedId: -1
    };
    this.handleAddCoLine = this.handleAddCoLine.bind(this);
    this.handleRemoveCoLine = this.handleRemoveCoLine.bind(this);

    console.log("Bound");
  }
  async componentDidMount() {
    const newState = { ...this.state};

    let response = await fetch("http://127.0.0.1:3001/customerOrders");
    let jsonMessage = await response.json();
    if (jsonMessage) {
      newState.content = jsonMessage.content;
    } else {
      console.log("json message failed");
    }
;
    response = await fetch("http://127.0.0.1:3001/recipes");
    jsonMessage = await response.json();
    if (jsonMessage) {
      newState.productNames = jsonMessage.content.map(item=>item.name);
      this.setState(newState);
    } else {
      console.log("json message failed");
    }
 
  }

  newCustomerOrder(e) {
    const newState = { ...this.state };
    newState.content.push({
      _id: `new001`,
      coNumber: `new001`,
      items: [
        {
          name: "New LineItem", 
          quantity: 0,
          unitCost: 2.99,
        }
      ],
      customer: { name: "Test2",address: "test3" }
    });
    this.setState(newState);
  }

  saveSelectedCO = e => {
      const saveItem = async (order) => {
      let data;
      if (order._id.includes("new")) {
        data = await postOrPutData(`http://127.0.0.1:3001/customerOrders`, {
          coNumber: order.coNumber,
          items: order.items,
          customer : order.customer
        });
      } else {
        data = await postOrPutData(`http://127.0.0.1:3001/customerOrders/${order._id}`, {
          coNumber: order.coNumber,
          items: order.items,
          customer: order.customer
        },"PUT");
      }
      if (data) console.log(JSON.stringify(data));
      this.setState({ ...this.state, alertMessage: data.message });
      setTimeout(() => { this.setState({ ...this.state, alertMessage: undefined }) }, 3000);

    }

    const foundItem = this.state.content.find(i=>this.state.selectedId === i._id);
    saveItem(foundItem);
  }

  handleItemSelect = (event) => {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  }

  handleChangeCO = (event, idx) => {
    console.log(event.target.value);
    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    
    if (event.target.name === "quantity")
      foundItem.items[idx].quantity = event.target.value;
    if (event.target.name === "name")
      foundItem.items[idx].name = event.target.value;
    if (event.target.name === "unitCost")
      foundItem.items[idx].unitCost = event.target.value;
    
    this.setState(newState);
  }

  handleRemoveCoLine = (event,idx) => {

    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    foundItem.items = [ ...foundItem.items];
    foundItem.items.splice(idx,1);
    this.setState(newState);
  }


  handleAddCoLine = (event) => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    foundItem.items.push({
      name: 'New Item',
      quantity: 1,
      unitCost: .01,
    });
    this.setState(newState);
  }

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
            {this.state.content.map((order,idx) => (
              <option value={order._id} key={idx}>
                {`${order.coNumber} ${order.customer.name}`}
              </option>
            ))}
          </select>
          {this.state.selectedId !== -1 && (
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
              onClick={e => this.newCustomerOrder(e)}
            >
              New Customer Order
            </Button>
            <Button className="delete" color="warning" onClick={this.saveSelectedCO}>
              Save Current
            </Button>
          </div>
        </div>
        {this.state.alertMessage &&
          <UncontrolledAlert color={this.state.alertMessage.includes("ERROR:") ? "danger" : "info"} >
            {this.state.alertMessage}
          </UncontrolledAlert>}

      </div>
    );
  }
}

export default CustomerOrderList; 