"use strict;";
//@ts-check
import React, { Component } from "react";
import { Table } from "reactstrap";

let API_URL;

process.env.REACT_APP_STAGE === 'dev'
  ? API_URL = 'http://localhost:3001'
  : API_URL = 'http://simplerp.herokuapp.com';

class Inventory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: [
                {  name: "Item1", quantity: 10},
                {  name: "Item2", quantity: 11}
            ]
        };
    }

    async componentDidMount() {
        const response = await fetch(`${API_URL}/inventory`);
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
                        <th>Avg Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.content.map(item => (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{(Math.floor(100 * item.avgCost) /100).toFixed(2)}</td>
                        </tr>))
                    }
                </tbody>
     
        </Table>);
    }
}

export default Inventory;