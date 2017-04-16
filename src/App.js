import React from "react";
import logo from "./logo.svg";
import "./App.css";

import {browserHistory} from "react-router";
import {MenuItem, Modal, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

import LogInForm from "./forms/LogInForm.jsx";
import SessionManager from "./services/Session.jsx";
import {GetDetails} from "./api/Users.jsx";


class App extends React.Component {

    constructor() {
        super(...arguments);
        this.state = {
            show: false,
            isLogIn: SessionManager.isLogIn(),
            user: undefined,
            appIsLoading: true,
        };
    }

    componentDidMount() {
        if (this.state.isLogIn) {
            this.getUserDetails()
        } else {
            this.setState({appIsLoading: false});
        }
    }

    showModalLogIn() {
        this.setState({
            show: true
        });
    }

    hideModalLogIn() {
        this.setState({
            show: false
        });
    }

    onSuccessLogin() {
        this.setState({
            isLogIn: SessionManager.isLogIn()
        }, this.hideModalLogIn());
        this.getUserDetails();
        browserHistory.push('/');
    }

    logout() {
        SessionManager.remove();
        this.setState({
            isLogIn: SessionManager.isLogIn(),
            user: undefined
        }, browserHistory.push('/'));
    }

    getUserDetails() {
        if (SessionManager.isLogIn()) {
            GetDetails({
                onSuccess: function (json) {
                    let user = SessionManager.get();
                    user.setDetails(json);
                    this.setState({
                        user: user,
                        appIsLoading: false,
                    })
                }.bind(this),
                onError: function (json) {
                    // this.logout()
                }
            })
        }
    }

    render() {
        const guestMenu = (
            <Nav pullRight>
                <LinkContainer to="/join"><NavItem>Sign up</NavItem></LinkContainer>
                <NavItem onClick={this.showModalLogIn.bind(this)}>Log in</NavItem>
            </Nav>
        );

        const userMenu = (
            <Nav pullRight>
                <NavDropdown noCaret className="user-menu" title="" id="basic-nav-dropdown">
                    <MenuItem>Settings</MenuItem>
                    <MenuItem divider/>
                    <MenuItem onClick={this.logout.bind(this)}>Log out</MenuItem>
                </NavDropdown>
            </Nav>
        );

        const login = (
            <Modal show={this.state.show} onHide={this.hideModalLogIn.bind(this)}>
                <Modal.Body>
                    <LogInForm onSuccessLogin={this.onSuccessLogin.bind(this)}/>
                </Modal.Body>
                <Modal.Footer>
                    {"Don't have an account?"}
                </Modal.Footer>
            </Modal>
        );

        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">
                                <img src={logo} className="app-logo" alt="logo"/> hld.
                            </a>
                        </Navbar.Brand>
                        { this.state.isLogIn ? "" : <Navbar.Toggle /> }
                    </Navbar.Header>
                    <Navbar.Collapse>
                        { this.state.isLogIn ? userMenu : guestMenu }
                    </Navbar.Collapse>
                </Navbar>

                {login}

                <div className="container">
                    { this.state.appIsLoading ? "" : React.cloneElement(this.props.children, this.state) }
                </div>
            </div>
        );
    }
}

export default App;
