import React from "react";

import {Button, Jumbotron} from "react-bootstrap";

import CompanyForm from "../forms/CompanyForm.jsx";
import {ImportEmployeesModal} from "./ImportEmployees";
import SessionManager from "./../services/Session.jsx";


export class U extends React.Component {

    render() {
        SessionManager.refreshUserDetails()
        let user = SessionManager.get();
        if (!user.isInCompany()) {
            return (
                <div>
                    <h1>Join us</h1>
                </div>
            )
        } else {
            return (<FirstLogInComponent />)
        }
    }
}

export class FirstLogInComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            companyCreated: false,
        }
    }

    onFormSuccess(data) {
        this.setState({companyCreated: true})
    }

    showModal() {
        this.setState({showImportEmployeesModel: true});
    }

    render() {
        if (this.state.companyCreated) {
            return (
                <Jumbotron>
                    <h1>Almost there!</h1>
                    <p>Well done you successfully created your company. The last step is to import your employees.</p>
                    <p><Button onClick={this.showModal.bind(this)} bsStyle="primary">Import employees</Button></p>
                    <ImportEmployeesModal open={this.state.showImportEmployeesModel} />
                </Jumbotron>
            );
        } else {
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

}
