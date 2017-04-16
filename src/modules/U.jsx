import React from "react";

import {Button, Jumbotron} from "react-bootstrap";

import CompanyForm from "../forms/CompanyForm.jsx";


export class U extends React.Component {

    render() {
        if (this.props.user === undefined) {
            return (
                <div>
                    <h1>Join us</h1>
                </div>
            )
        } else {
            return (
                <div>
                    { this.props.user.isInCompany() ? <EmployeeList /> : <CreateCompany /> }
                </div>
            )
        }
    }
}

export class CreateCompany extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createCompany: false
        }
    }

    onFormSuccess(_json) {
        this.setState({createCompany: true})
    }

    render() {
        const form = (
            <div>
                <h1>Hello stranger</h1>
                <p className="lead">
                    It seems that you just created your account. Please set up your company before you
                    invite your employees.</p>
                <CompanyForm onFormSuccess={this.onFormSuccess.bind(this)}/>
            </div>
        );
        const importEmployees = (
            <Jumbotron>
                <h1>Almost there!</h1>
                <p>Well done you successfully created your company. The last step is to import your employees.</p>
                <p><Button href="/employees/import" bsStyle="primary">Import employees</Button></p>
            </Jumbotron>
        );
        return this.state.createCompany ? form : importEmployees;
    }

}

export class EmployeeList extends React.Component {

    render() {
        return (<div>
            <h1>{"Look who's working here"}</h1>
        </div>)
    }

}
