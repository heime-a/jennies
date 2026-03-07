import React, { useState, useEffect, useContext } from "react";
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
import LoginForm from "./components/LoginForm";
import ErrorBoundary from "./components/ErrorBoundary";
import jenniesLogo from "./assets/jennies.jpg";

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
  const { loggedIn, logout } = useContext(AuthContext);
  return (
    <>
      {loggedIn && (
        <div className="logout-wrapper">
          <Button color="warning" onClick={logout}>
            Log Out
          </Button>
        </div>
      )}
    </>
  );
}

const Navigation: React.FC<{ items: Array<string> }> = ({ items }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [hamburgerVisible, setHamburgerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setHamburgerVisible(window.innerWidth <= 760);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => setCollapsed(!collapsed);
  const closeNavbar = () => {
    if (hamburgerVisible) setCollapsed(true);
  };

  return (
    <Navbar color="light" expand="md" className="main-navbar">
      <NavbarBrand href="/" className="me-auto">
        <img src={jenniesLogo} alt="Jennies Logo" className="logo" />
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="ms-2" />
      <Collapse isOpen={!collapsed} navbar>
        <Nav className="ms-auto" navbar>
          {items.map((item) => (
            <NavItem key={item}>
              <NavLink
                to={`/${item}`}
                tag={RRNavLink}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive ? "selected nav-link" : "nav-link"
                }
                onClick={closeNavbar}
              >
                {item}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

const App: React.FC = () => {
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
                  <Navigation items={loggedIn ? menuItems : ["Login"]} />
                  <Routes>
                    <Route path="/Login" element={<LoginForm />} />
                    <Route path="/Ingredients" element={<IngredientList />} />
                    <Route path="/Purchasing" element={<PurchaseOrderList />} />
                    <Route path="/Inventory" element={<Inventory />} />
                    <Route path="/Recipe" element={<RecipeList />} />
                    <Route path="/Manufacturing" element={<WorkOrderList />} />
                    <Route
                      path="/Product Inventory"
                      element={<ProductInventory />}
                    />
                    <Route path="/Customer Orders" element={<CustomerOrders />} />
                    <Route path="/LogOut" element={<LogOut />} />
                    <Route path="/" element={<LoginForm />} />
                  </Routes>
                </div>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </div>
  );
};

export default App;
