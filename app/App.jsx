import React from 'react';
import {
  Link
} from 'react-router'

import {
  Navbar,
  NavItem,
  MenuItem,
  Nav,
  NavDropdown
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';


const navbarInstance = (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/" className="navbar-brand">hld.</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <LinkContainer to="/about"><NavItem>About</NavItem></LinkContainer>
        <LinkContainer to="/join"><NavItem>Join</NavItem></LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

class App extends React.Component {
  render() {
    return (
      <div>
        {navbarInstance}
          <div className="container">
            {this.props.children}
          </div>
      </div>
    );
  }
}

export default App;
