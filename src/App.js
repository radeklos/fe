import React from "react";
import logo from "./logo.svg";
import "./App.css";

import {BrowserRouter, Route, Switch} from "react-router-dom";
import {MenuItem, Modal, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

import {LogInForm} from "./forms/LogInForm.jsx";
import SessionManager from "./services/Session.jsx";
import {GetDetails} from "./api/Users.jsx";

import {Join} from "./modules/Join.jsx";
import {U} from "./modules/U.jsx";
import {Settings} from "./modules/Settings";
import {config} from "./config";


class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            show: false,
            isLogIn: SessionManager.isLogIn()
        };
        console.log('config: ', config);
        console.log('token: ', SessionManager.getToken());

        this.logout = this.logout.bind(this);
        this.onSuccessLogin = this.onSuccessLogin.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
    }

    componentWillMount() {
        if (SessionManager.isLogIn()) {
            this.getUserDetails()
        }
    }

    showModalLogIn() {
        this.setState({show: true});
    }

    hideModalLogIn() {
        this.setState({show: false});
    }

    onSuccessLogin() {
        this.setState({
            isLogIn: SessionManager.isLogIn()
        }, this.hideModalLogIn());
        this.getUserDetails();
    }

    logout() {
        SessionManager.remove();
        this.setState({
            user: undefined,
            redirectToHome: true
        });
    }

    getUserDetails() {
        GetDetails({
            onSuccess: (json) => {
                SessionManager.saveUserDetails(json);
                this.setState({isLogIn: true});
            },
            onError: (json) => {
                this.logout()
            }
        })
    }

    render() {
        const isLogIn = SessionManager.isLogIn();

        const guestMenu = (
            <Nav pullRight>
                <LinkContainer to="/join"><NavItem>Sign up</NavItem></LinkContainer>
                <NavItem onClick={this.showModalLogIn.bind(this)}>Log in</NavItem>
            </Nav>
        );

        const userMenu = (
            <Nav pullRight>
                <NavDropdown noCaret className="user-menu" title="" id="basic-nav-dropdown">
                    <LinkContainer to='/settings'><MenuItem>Settings</MenuItem></LinkContainer>
                    <MenuItem divider />
                    <MenuItem onClick={this.logout.bind(this)}>Log out</MenuItem>
                </NavDropdown>
            </Nav>
        );

        const login = (
            <Modal show={this.state.show} onHide={ this.hideModalLogIn.bind(this) }>
                <Modal.Body>
                    <LogInForm onSuccessLogin={ this.onSuccessLogin.bind(this) }/>
                </Modal.Body>
                <Modal.Footer>
                    {"Don't you have an account?"}
                </Modal.Footer>
            </Modal>
        );

        return (
            <BrowserRouter>
                <div>
                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="/">
                                    <img src={logo} className="app-logo" alt="logo"/> chll
                                </a>
                            </Navbar.Brand>
                            { isLogIn ? "" : <Navbar.Toggle /> }
                        </Navbar.Header>
                        <Navbar.Collapse>
                            { isLogIn ? userMenu : guestMenu }
                        </Navbar.Collapse>
                    </Navbar>

                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={U} />
                            <Route path="/settings" component={Settings} />

                            <Route path="/join" component={Join} />
                        </Switch>
                    </div>

                    { login }

                </div>
            </BrowserRouter>
        );
    }
}

export default App;
