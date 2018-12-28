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
        { coNumber: 1, supplier: { name: "Test1" } },
        { coNumber: 2, supplier: { name: "Test2" } }
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
      supplier: { name: "Test2" }
    });
    this.setState(newState);
  }

  saveSelectedCO = e => {
      const saveItem = async (item) => {
      let data;
      if (item._id.includes("new")) {
        data = await postOrPutData(`http://127.0.0.1:3001/customerOrders`, {
          coNumber: item.name,
          items: items,
          supplier: item.supplier
        });
      } else {
        data = await postOrPutData(`http://127.0.0.1:3001/customerOrders/${item._id}`, {
          coNumber: item.coNumber,
          items: items,
          customer: item.supplier
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
      foundItem.lineItems[idx].quantity = event.target.value;
    if (event.target.name === "name")
      foundItem.lineItems[idx].name = event.target.value;
    if (event.target.name === "unitCost")
      foundItem.lineItems[idx].unitCost = event.target.value;
    

    console.log(foundItem.ingredients[idx].ingredient.unitCost);
    this.setState(newState);
  }

  handleRemovePoLine = (event,idx) => {

    const newState = { ...this.state };

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );

    foundItem.ingredients = [ ...foundItem.ingredients];
    foundItem.ingredients.splice(idx,1);
    this.setState(newState);
  }


  handleAddPoLine = (event) => {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    foundItem.ingredients.push({
      quantity: 1,
      ingredient: { name: "New Item", unit: "",  unitCost: .01 }
    });
    this.setState(newState);
  }

  render() {
    const foundItem = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    return (
      <div>
        <div id="poListGrid">
          <select
            size={10}
            className="purchaseOrderList"
            onChange={e => this.handleItemSelect(e)}
          >
            {this.state.content.map(item => (
              <option value={item._id} key={item._id}>
                {`${item.poNumber} ${item.supplier.name}`}
              </option>
            ))}
          </select>
          {this.state.selectedId !== -1 && (
            <CustomerOrderForm
              item={foundItem}
              onChange={this.handleChangePO}
              onAddLine={this.handleAddPoLine}
              onRemoveLine={this.handleRemovePoLine}
              ingNames={this.state.ingNames}
            />
          )}
          <div className="poButtons">
            <Button
              color="success"
              className="newPO"
              onClick={e => this.newCustomerOrder(e)}
            >
              New Csutomer Order
            </Button>
            <Button color="warning" onClick={this.saveSelectedPO}>
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