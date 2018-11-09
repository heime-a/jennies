import React, { Component } from "react";
import { Button } from "reactstrap";
import PurchaseOrderForm from "./PurchaseOrderForm";

function postOrPutData(url = ``, data = {}, method = "POST") {
  // Default options are marked with * Function for posting data
  return fetch(url, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }).then(response => response.json()); // returns a promise
}

export class PurchaseOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        { poNumber: 1, supplier: { name: "Test1" } },
        { poNumber: 2, supplier: { name: "Test2" } }
      ],
      selectedId: -1
    };
    this.handleChangePO = this.handleChangePO.bind(this);
    console.log("Bound");
  }
  componentDidMount() {
    fetch("http://127.0.0.1:3001/purchaseOrders")
      .then(response => {
        return response.json();
      })
      .then(jsonMessage => {
        this.setState({ content: jsonMessage.content });
      });
  }

  newPurchaseOrder(event) {
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

  saveModifiedPOs(e) {
    async function saveItem(item) {
      if (item._id.includes("new")) {
        const data = await postOrPutData(`http://127.0.0.1:3001/purchaseOrders`, {
          poNumber: item.poNumber,
          ingredients: item.ingredients,
          supplier: item.supplier
        });
        if (data) console.log(JSON.stringify(data));
      } else {
        const data = await postOrPutData(`http://127.0.0.1:3001/purchaseOrders/${item._id}`, {
          poNumber: item.poNumber,
          ingredients: item.ingredients,
          supplier: item.supplier
        },"PUT");
        if (data) console.log(JSON.stringify(data));

      }
    }

    const newState = { ...this.state };

    for(let item of newState.content) {
      saveItem(item);
    }
  }

  handleItemSelect(event) {
    const newState = { ...this.state };
    newState.selectedId = event.target.value;
    this.setState(newState);
  }

  handleChangePO(event, ing) {
    const newState = { ...this.state };

    console.log(`this: ${this}`);

    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    const foundIng = foundItem.ingredients.find(i => i === ing);
    if (event.target.name === "quantity")
      foundIng.quantity = event.target.value;
    if (event.target.name === "name")
      foundIng.ingredient.name = event.target.value;
    this.setState(newState);
  }

  handleAddPoLine(event) {
    const newState = { ...this.state };
    const foundItem = newState.content.find(
      el => el._id === newState.selectedId
    );
    foundItem.ingredients.push({
      quantity: 1,
      ingredient: { name: "New Item", unit: "" }
    });
    this.setState(newState);
  }

  render() {
    const foundItem = this.state.content.find(
      el => el._id === this.state.selectedId
    );
    return (
      <React.Fragment>
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
            <PurchaseOrderForm
              item={foundItem}
              onChange={this.handleChangePO}
              onAddLine={e => this.handleAddPoLine(e)}
            />
          )}
          <div className="poButtons">
            <Button
              color="success"
              className="newPO"
              onClick={e => this.newPurchaseOrder(e)}
            >
              New Purchase Order
            </Button>
            <Button color="success" onClick={e => this.saveModifiedPOs(e)}>
              Save Modified POs
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
