"use strict;";
//@ts-check
//TODO: Put ingredient inventory in its own 'Card'
import "./inventory.css";
import React, { Component } from "react";
import { Table } from "reactstrap";
import apiUrl from "../common/apiurl.js";

class Inventory extends Component {
  state = {
    content: [
      { name: "Item1", quantity: 10, avgCost: 0 },
      { name: "Item2", quantity: 11, avgCost: 0 },
    ],
  };

  async componentDidMount() {
    const response = await fetch(`${apiUrl()}/inventory`);
    const jsonMessage = await response.json();
    if (jsonMessage) {
      this.setState({ content: jsonMessage.content });
    } else {
      console.log("json message failed");
    }
  }

  render() {
    return (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>On Hand</th>
              <th>Avg Cost</th>
            </tr>
          </thead>
          <tbody>
            {this.state.content.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{(Math.floor(100 * item.avgCost) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    );
  }
}

export default Inventory;
