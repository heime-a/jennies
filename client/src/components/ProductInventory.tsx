"use strict;";
import "./ProductInventory.css";
import React, { Component } from "react";
import { Table } from "reactstrap";
import apiUrl from "../common/apiurl.js";

//TODO: Put Product inventory in its own card
class Inventory extends Component {
  state = {
    content: [
      { name: "Item1", quantity: 10, unitCost: 99 },
      { name: "Item2", quantity: 11, unitCost: 99 },
    ],
  };

  async componentDidMount() {
    const response = await fetch(`${apiUrl()}/productInventory`);
    const jsonMessage = await response.json();
    if (jsonMessage) {
      this.setState({ content: jsonMessage.content });
    } else {
      console.log("json message failed");
    }
  }

  render() {
    return (
      <div className="card">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>On Hand</th>
            </tr>
          </thead>
          <tbody>
            {this.state.content.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Inventory;
