import "./inventory.css";
import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import apiUrl from "../common/apiurl.js";

interface InventoryItem {
  name: string;
  quantity: number;
  avgCost: number;
}

function Inventory() {
  const [content, setContent] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const loadInventory = async () => {
      const response = await fetch(`${apiUrl()}/inventory`);
      const jsonMessage = await response.json();
      if (jsonMessage) {
        setContent(jsonMessage.content);
      }
    };
    loadInventory();
  }, []);

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
        {content.map((item) => (
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

export default Inventory;
