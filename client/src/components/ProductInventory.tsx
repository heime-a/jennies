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
      const response = await fetch(`${apiUrl()}/productInventory`, { credentials: 'include' });
      const jsonMessage = await response.json();
      setContent(Array.isArray(jsonMessage.content) ? jsonMessage.content : []);
    };
    loadProducts();
  }, []);

  return (
    <>
      <h2 className="page-title">Product Inventory</h2>
      <div className="page-content product-inventory-page">
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
      </div>
    </>
  );
}

export default ProductInventory;
