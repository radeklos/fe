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
import {browserHistory} from 'react-router'

import Join from './modules/Join.jsx'
import SessionManager from './services/Session.jsx'


export default React.createClass({

  getInitialState() {
    return {
      show: false,
      isLogIn: SessionManager.isLogIn()
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

  onSuccessLogin() {
    this.setState({
      isLogIn: SessionManager.isLogIn()
    }, this.hideModal());
    browserHistory.push('/')
  },

  render() {
    const guestMenu = (
      <Nav pullRight>
        <LinkContainer to="/join"><NavItem>Sign up</NavItem></LinkContainer>
        <NavItem onClick={this.showModal}>Log in</NavItem>
      </Nav>
    );

    const userMenu = (
      <Nav pullRight>
        <NavDropdown noCaret className="user-menu" title="" id="basic-nav-dropdown">
          <MenuItem>Settings</MenuItem>
          <MenuItem divider />
          <MenuItem>Log out</MenuItem>
        </NavDropdown>
      </Nav>
    );

    const login = (
      <Modal show={this.state.show} onHide={this.hideModal}>
        <Modal.Body>
          <LogInForm onSuccessLogin={this.onSuccessLogin} />
        </Modal.Body>
        <Modal.Footer>
          Don't have an account?
        </Modal.Footer>
      </Modal>
    )

    return (
      <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">hld.</a>
          </Navbar.Brand>
          { this.state.isLogIn ? "" : <Navbar.Toggle /> }
        </Navbar.Header>
          <Navbar.Collapse>
            { this.state.isLogIn ?  userMenu : guestMenu }
          </Navbar.Collapse>
        </Navbar>

        {login}
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
})
