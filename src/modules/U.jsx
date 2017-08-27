import React from "react";

import {Button, Jumbotron} from "react-bootstrap";
import {Route} from "react-router-dom";

import SessionManager from "../services/Session.jsx";
import CompanyForm from "../forms/CompanyForm.jsx";
import {ImportEmployeesModal} from "./ImportEmployees";
import {Employees} from "./Employees";
import {Settings} from "./Settings";


export class U extends React.Component {
    render() {
        if(SessionManager.isLogIn()) {
            const companyId = SessionManager.getUserDetails().getCompanyId();
            if (!!companyId) {
                return (
                    <div>
                        <Route path="/" exact component={Employees} />
                        <Route path="/settings" component={Settings} />
                    </div>
                );
            } else {
                return (<CreateCompany />);
            }
        } else {
            return (
                <div>
                    <h1>Join us</h1>
                </div>
            )
        }
    }
}

export class CreateCompany extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            companyCreated: false,
        }
    }

    onFormSuccess(data) {
        this.props.history.push('/newcomers/import-employees')
    }

    render() {
        return (
            <div>
                <h1>Hello stranger</h1>
                <p className="lead">
                    It seems that you just created your account. Please set up your company before you
                    invite your employees.
                </p>
                <CompanyForm onFormSuccess={this.onFormSuccess.bind(this)} />
            </div>
        );
    }
}

export class ImportEmployees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showImportEmployeesModel: false,
        }
    }

    showModal() {
        this.setState({showImportEmployeesModel: true});
    }

    render() {
        return (
            <Jumbotron>
                <h1>Almost there!</h1>
                <p>Well done you successfully created your company. The last step is to import your employees.</p>
                <p><Button onClick={this.showModal.bind(this)} bsStyle="primary">Import employees</Button></p>
                <ImportEmployeesModal open={this.state.showImportEmployeesModel} />
            </Jumbotron>
        );
    }
}
