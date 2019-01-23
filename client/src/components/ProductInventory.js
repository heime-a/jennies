"use strict;";
//@ts-check
import React, { Component } from "react";
import { Table } from "reactstrap";

class Inventory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: [
                { name: "Item1", quantity: 10 , unitCost: 99},
                { name: "Item2", quantity: 11 , unitCost: 99}
            ]
        };
    }

    async componentDidMount() {
        const response = await fetch("http://127.0.0.1:3001/productInventory");
        const jsonMessage = await response.json();
        if (jsonMessage) {
            this.setState({ content: jsonMessage.content });
        } else {
            console.log("json message failed");
        }
    }


    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>On Hand</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.content.map(item => (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                        </tr>))
                    }
                </tbody>

            </Table>);
    }
}

export default Inventory;