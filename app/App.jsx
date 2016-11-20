import React from 'react';
import {
  Link
} from 'react-router'
import {
  Navbar,
  NavItem,
  MenuItem,
  Nav,
  NavDropdown,
  Modal
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';
import LogInForm from './forms/LogInForm.jsx'

import Join from './modules/Join.jsx'


export default React.createClass({

  getInitialState() {
    return {
      show: false
    };
  },

  showModal() {
    this.setState({
      show: true
    });
  },

  hideModal() {
    this.setState({
      show: false
    });
  },

  render() {
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
            <NavItem onClick={this.showModal}>Log in</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );

    const login = (
      <Modal show={this.state.show} onHide={this.hideModal}>
        <Modal.Body>
          <LogInForm />
        </Modal.Body>
        <Modal.Footer>
          Don't have an account?
        </Modal.Footer>
      </Modal>
    )

    return (
      <div>
        {navbarInstance}
        {login}
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
})
