import React from "react";
import {Redirect, Route, Switch} from 'react-router'

import "whatwg-fetch";

import {Col, Form, FormGroup} from "react-bootstrap";
import FormField from "../forms/FormField.jsx";
import FormButton from "../forms/FormButton.jsx";
import {PerformRegistration} from "../api/Users.jsx";

export class Join extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path="/join" component={() => <JoinForm />} />
                <Route path="/join/finished" render={() => <Finished />} />
            </Switch>
        );
    }

}

class JoinForm extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            data: {},
            errors: {},
            isLoading: false,
            finished: false
        };
        this.verifyPassword = this.verifyPassword.bind(this);
    }

    onSubmit(e) {
        this.verifyPassword();
        if (Object.keys(this.state.errors).length === 0) {
            this.setState({
                isLoading: true,
                finished: true
            });
            PerformRegistration({
                body: {
                    firstName: this.state.data.firstName,
                    lastName: this.state.data.lastName,
                    email: this.state.data.email,
                    password: this.state.data.password
                },
                onSuccess: function () {
                    this.state({finished: true});
                },
                onError: function (json) {
                    let errors = {};
                    for (const key in json.errors) {
                        errors[key] = json.errors[key].defaultMessage
                    }
                    this.setState({
                        errors: errors,
                        isLoading: false
                    })
                }.bind(this)
            })
        }
        e.preventDefault();
    }

    onChange(e) {
        let data = this.state.data;
        let errors = this.state.errors;
        data[e.target.name] = e.target.value;
        delete errors[e.target.name];
        this.setState({
            data: data,
            errors: errors
        })
    }

    verifyPassword() {
        let passwordVerified = this.state.data.hasOwnProperty('verifyPassword') ? this.state.data.verifyPassword : "";
        const errors = this.state.errors;
        delete errors["verifyPassword"];
        if (this.state.data.hasOwnProperty('password') && this.state.data['password'].length > 0) {
            if (this.state.data['password'] !== passwordVerified) {
                errors['verifyPassword'] = 'Passwords are not same'
            }
        }
        this.setState({
            errors: errors
        })
    }

    render() {
        if (this.state.finished) {
            return <Redirect to="/join/finished" push={true} />
        }

        return (<div>
            <h1>Join</h1>
            <Form horizontal onSubmit={ this.onSubmit.bind(this) } method="post" autoComplete="off">
                <FormField
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    error={ this.state.errors.firstName }
                    onChange={ this.onChange.bind(this) }>First name</FormField>
                <FormField
                    type="text"
                    placeholder="Last name"
                    name="lastName"
                    error={ this.state.errors.lastName }
                    onChange={ this.onChange.bind(this) }>Last name</FormField>
                <FormField
                    type="email"
                    placeholder="Email"
                    name="email"
                    error={ this.state.errors.email }
                    onChange={ this.onChange.bind(this) }>Email</FormField>
                <FormField
                    type="password"
                    placeholder=""
                    name="password"
                    error={ this.state.errors.password }
                    onChange={ this.onChange.bind(this) }>Password</FormField>
                <FormField
                    type="password"
                    placeholder="Verify password"
                    name="verifyPassword"
                    error={ this.state.errors.verifyPassword }
                    onChange={ this.onChange.bind(this) }
                    onBlur={ this.verifyPassword }/>

                <FormGroup>
                    <Col sm={8} smOffset={2}>
                        <FormButton
                            isLoading={ this.state.isLoading }
                            bsStyle="success">Sign in</FormButton>
                    </Col>
                </FormGroup>
            </Form>
        </div>)
    }
}


class Finished extends React.Component {
    render() {
        return (<div>
            <h1>Check your email</h1>
            <p>{"We've send a message to your email. Open it up and click Active Account. We'll take if from there."}</p>
        </div>)
    }
}
