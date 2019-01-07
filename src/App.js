'use strict;'
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { IngredientList } from './components/IngredientList';
import PurchaseOrderList from "./components/PurchaseOrderList";
import Inventory from "./components/Inventory";
import ProductInventory from "./components/ProductInventory";
import { RecipeList } from "./components/RecipeList";
import  WorkOrderList from "./components/WorkOrderList";
import  CustomerOrders from "./components/CustomerOrderList";

import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';



class App extends Component {
  render() {
    const menuItems = ['Ingredients','Purchasing','Inventory','Recipe','Manufacturing','Product Inventory','Customer Orders']
    return <div className="App">
        <div className="App-header">
          <MyApp items={menuItems} />
        </div>
      </div>;
  }
}


const MyApp = ({items}) => {
  return <Router>
      <div>
        <Navbar color="light" expand="md">
          <NavbarBrand href="/">
            <img src={require("./assets/jennies.jpg")} alt="Jennies Logo" />
          </NavbarBrand>
          <Collapse navbar>
            <Nav className="ml-auto" navbar>
              {items.map(item => 
                <NavItem key={item}>
                  <Link className="nav-link" to={item}>{item}</Link>
                </NavItem>)}
            </Nav>
          </Collapse>
        </Navbar>
        <Route path="/Ingredients" exact component={IngredientList} />
        <Route path="/Purchasing" exact component={PurchaseOrderList} />
        <Route path="/Inventory" exact component={Inventory} />
        <Route path="/Recipe" exact component={RecipeList} />
        <Route path="/Manufacturing" exact component={WorkOrderList} />
        <Route path="/Product Inventory" exact component={ProductInventory} />
        <Route path="/Customer Orders" exact component={CustomerOrders} />
        
      </div>
    </Router>;
};




export default App;
