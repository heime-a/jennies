'use strict;'
//TODO: use componentunmount to free react resources / save state when exiting screen ?
//TODO: Global transaction number scheme
//TODO: Statuses for purchase orders and exclusion of non completed PO statuses from totals 
//TODO: Statuses for customer orders and exclusion of non completed PO statuses from totals 
//TODO: Implement user authentication
//TODO: Optimize layout for smaller devices(phone)
//TODO: Add modal dialogs for search functions

//TODO: Message on ingredient save and update test
//TODO: Customer orders dont apply to production inventory xx works
//TODO: costing of recipe items from average price on inventory screen XXX

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
import isLoggedIn from "./common/isLoggedIn";
import LoginForm from "./components/LoginForm";

import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler } from 'reactstrap';
import apiUrl from './common/apiurl';

function LogOut() {

  window.localStorage.removeItem(apiUrl()+'token');
  return(<div>Successfully Logged Out</div>);
}

class App extends Component {
  constructor(props) {
    super(props);
    const loggedIn = isLoggedIn()
    this.state = { loggedIn }
  }
  

  render() {
    const menuItems = ['Ingredients','Purchasing','Inventory',
                        'Recipe','Manufacturing','Product Inventory','Customer Orders','LogOut']
    const login = ['Login'];
    return <div className="App">
        <div className="App-header">
          <MyApp items={ this.state.loggedIn ? menuItems : login} />
        </div>
      </div>;
  }
}


class MyApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };

  }
  render() { 
    return(<Router>
      <div>
        <Navbar color="light" expand="md">
          <NavbarBrand href="/">
            <img src={require("./assets/jennies.jpg")} alt="Jennies Logo" />
          </NavbarBrand>
          <NavbarToggler 
               onClick={()=>{ this.setState({ collapsed:!this.state.collapsed })}} />
          <Collapse onClick={()=>{ this.setState({ collapsed:!this.state.collapsed })}} 
                    isOpen={!this.state.collapsed} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.items.map(item => 
                <NavItem key={item}>
                  <Link className="nav-link" to={item}>{item}</Link>
                </NavItem>)}
            </Nav>
          </Collapse>
        </Navbar>
        <Route path="/Login" exact component={LoginForm} />
        <Route path="/Ingredients" exact component={IngredientList} />
        <Route path="/Purchasing" exact component={PurchaseOrderList} />
        <Route path="/Inventory" exact component={Inventory} />
        <Route path="/Recipe" exact component={RecipeList} />
        <Route path="/Manufacturing" exact component={WorkOrderList} />
        <Route path="/Product Inventory" exact component={ProductInventory} />
        <Route path="/Customer Orders" exact component={CustomerOrders} />
        <Route path="/LogOut" exact component={LogOut} />
        
      </div>
    </Router>);
  }
};




export default App;
