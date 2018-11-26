import React, { Component } from "react";

import { Select } from "reactstrap";

class WorkOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [
        {
          woNumber: "wo0001",
          recipeName: "Chocolate Macaroons",
          startDate: "01/01/80",
          status: "In Process",
          actualHours: 5
        },
        {
          woNumber: "wo0002",
          recipeName: "Vanilla Macaroons",
          startDate: "01/01/80",
          status: "Completed",
          actualHours: 4
        }
      ]
    };
  }
  render() {
    return (
      <>
        <select size={10}>
          {this.state.content.map(({ woNumber, status, startDate }) => (
            <option>
              {startDate} {woNumber} {status}
            </option>
          ))}
        </select>
      </>
    );
  }
}

export default WorkOrderList;
