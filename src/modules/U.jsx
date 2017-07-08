import React from "react";

import {Button, Jumbotron} from "react-bootstrap";

import CompanyForm from "../forms/CompanyForm.jsx";
import {ImportEmployeesModal} from "./ImportEmployees";
import {Employees} from "./Employees";


export class U extends React.Component {

    render() {
        if(this.props.isLogIn) {
            return (
                <div>
                    <Employees />
                </div>
            );
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
