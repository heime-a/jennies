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
      const response = await fetch(`${apiUrl()}/inventory`, { credentials: 'include' });
      const jsonMessage = await response.json();
      setContent(Array.isArray(jsonMessage.content) ? jsonMessage.content : []);
    };
    loadInventory();
  }, []);

  return (
    <>
      <h2 className="page-title">Ingredient Inventory</h2>
      <div className="page-content inventory-page">
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
      </div>
    </>
  );
}

export default Inventory;
