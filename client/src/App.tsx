"use strict;";
//TODO: Add modal dialogs for search functions in PO
//TODO: use componentunmount to free react resources / save state when exiting screen ?
//TODO: Global transaction number scheme
//TODO: Statuses for purchase orders and exclusion of non completed PO statuses from totals
//TODO: Statuses for customer orders and exclusion of non completed PO statuses from totals
//TODO: Implement user authentication
//TODO: Optimize layout for smaller devices(phone)

//TODO: Message on ingredient save and update test
//TODO: Customer orders dont apply to production inventory xx works
//TODO: costing of recipe items from average price on inventory screen XXX

import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink as RRNavLink,
} from "react-router-dom";
import "./App.css";
import AuthProvider, { AuthContext } from "./components/AuthContext";
import { IngredientList } from "./components/IngredientList";
import PurchaseOrderList from "./components/PurchaseOrderList";
import Inventory from "./components/Inventory";
import ProductInventory from "./components/ProductInventory";
import { RecipeList } from "./components/RecipeList";
import WorkOrderList from "./components/WorkOrderList";
import CustomerOrders from "./components/CustomerOrderList";
import isLoggedIn from "./common/isLoggedIn";
import LoginForm from "./components/LoginForm";
import ErrorBoundary from "./components/ErrorBoundary";

import {
  Button,
  NavLink,
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler,
} from "reactstrap";

function LogOut() {
  return (
    <AuthContext.Consumer>
      {({ loggedIn, logout }) => (
        <>
          {loggedIn && (
            <div className="logout-wrapper">
              <Button color="warning" onClick={logout}>
                Log Out
              </Button>
            </div>
          )}
        </>
      )}
    </AuthContext.Consumer>
  );
}

class App extends Component {
  state = { loggedIn: isLoggedIn() };

  render() {
    const menuItems = [
      "Ingredients",
      "Purchasing",
      "Inventory",
      "Recipe",
      "Manufacturing",
      "Product Inventory",
      "Customer Orders",
      "LogOut",
    ];
    return (
      <div className="App">
        <ErrorBoundary>
          <Router>
            <AuthProvider>
              <AuthContext.Consumer>
                {({ loggedIn }) => (
                  <div className="App-header">
                    <MyApp items={loggedIn ? menuItems : ["Login"]} />
                  </div>
                )}
              </AuthContext.Consumer>
            </AuthProvider>
          </Router>
        </ErrorBoundary>
      </div>
    );
  }
}
interface MyAppState {
  collapsed: boolean;
  hamburgerVisible: boolean;
}
class MyApp extends Component<{ items: Array<string> }, MyAppState> {
  state = { collapsed: true, hamburgerVisible: false };

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({
      hamburgerVisible: window.innerWidth <= 760,
    });
  }

  render() {
    return (
      <>
        <Navbar color="light" expand="md">
          <NavbarBrand href="/">
            <img src={require("./assets/jennies.jpg")} alt="Jennies Logo" />
          </NavbarBrand>
          <NavbarToggler
            onClick={() => {
              this.setState({ collapsed: !this.state.collapsed });
            }}
          />
          <Collapse
            onClick={() => {
              this.state.hamburgerVisible &&
                this.setState({ collapsed: !this.state.collapsed });
            }}
            isOpen={!this.state.collapsed}
            navbar
          >
            <Nav className="ml-auto" navbar>
              {this.props.items.map((item) => (
                <NavItem key={item}>
                  <NavLink
                    to={`/${item}`}
                    tag={RRNavLink}
                    activeClassName="selected"
                  >
                    {item}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Navbar>
        <Routes>
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Ingredients" element={<IngredientList />} />
          <Route path="/Purchasing" element={<PurchaseOrderList />} />
          <Route path="/Inventory" element={<Inventory />} />
          <Route path="/Recipe" element={<RecipeList />} />
          <Route path="/Manufacturing" element={<WorkOrderList />} />
          <Route path="/Product Inventory" element={<ProductInventory />} />
          <Route path="/Customer Orders" element={<CustomerOrders />} />
          <Route path="/LogOut" element={<LogOut />} />
        </Routes>
      </>
    );
  }
}

export default App;
