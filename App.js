import React, { Component } from 'react';
import './App.css';
import { IngredientList } from './components/IngredientList';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';


class App extends Component {
  render() {
    const menuItems = ['Ingredients','Purchasing','Inventory','Manufacturing','Customer Orders']
    return (
      <div className="App">
        <div className="App-header">
          <Mynavbar items={menuItems} />
          <IngredientList />
        </div>
      </div>
    );
  }
}


const Mynavbar = ({items}) => {
  return (
      <Navbar color="light" expand="md">
        <NavbarBrand href="/">
            <img src={require('./assets/jennies.jpg')} alt="Jennies Logo"/>
        </NavbarBrand>
        <Collapse  navbar>
        <Nav className="ml-auto" navbar>
            {items.map(item=>(<NavItem key={item}><NavLink>{item}</NavLink></NavItem>))}
        </Nav>
        </Collapse>
      </Navbar>
  );
};




export default App;
