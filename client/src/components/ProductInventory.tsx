import "./ProductInventory.css";
import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import apiUrl from "../common/apiurl.js";

interface ProductItem {
  name: string;
  quantity: number;
}

function ProductInventory() {
  const [content, setContent] = useState<ProductItem[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch(`${apiUrl()}/productInventory`);
      const jsonMessage = await response.json();
      if (jsonMessage) {
        setContent(jsonMessage.content);
      }
    };
    loadProducts();
  }, []);

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Name</th>
          <th>On Hand</th>
        </tr>
      </thead>
      <tbody>
        {content.map((item) => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ProductInventory;
