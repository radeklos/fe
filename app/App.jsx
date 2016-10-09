import React from 'react';
import {Link} from 'react-router'

import NavLink from './modules/NavLink'
import {Navbar, NavItem, MenuItem, Nav, NavDropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const navbarInstance = (
    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <a className="navbar-brand" href="index.html">HLD.</a>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav pullRight>
                <LinkContainer to="/repos"><NavItem>Repos</NavItem></LinkContainer>
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
