import React from 'react';

import {Table, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl} from "react-bootstrap";

import FormField from "../forms/FormField.jsx";
import {Route, Switch} from "react-router";
import {Link} from 'react-router-dom'
import {GetDepartment, GetCompanyEmployees, CreateDepartment} from "../api/Companies.jsx";
import FormButton from "../forms/FormButton.jsx";
import {Toast} from '../components/Toast'
import {GetDetails, UpdateDetails} from "../api/Users.jsx";


class Signpost extends React.Component {
    render() {
        return (
            <div>
                <h1>Settings</h1>
                <Row>
                    <Col md={6}>
                        <h2><Link to="/settings/general">General Settings</Link></h2>
                    </Col>
                    <Col md={6}>
                        <h2><Link to="/settings/department">Department</Link></h2>
                    </Col>
                </Row>
            </div>
        )
    }
}


class Department extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoading: false,
            employees: [],
            departments: []
        };
    }

    componentDidMount() {
        this.fetchEmployees();
        this.fetchDepartments();
    }

    populateEmployees(response) {
        if(response.total >= 1) {
            this.setState({employees: response.items})
        }
    }

    fetchEmployees() {
        GetCompanyEmployees({onSuccess: this.populateEmployees.bind(this)});
    }

    fetchDepartments() {
        GetDepartment({onSuccess: this.pupulateListOfDepartments.bind(this)});
    }

    pupulateListOfDepartments(response) {
        if(response.total >= 1) {
            this.setState({departments: response.items})
        }
    }

    render() {
        return (
            <div>
                <h1>Department</h1>
                <Row>
                    <Col md={12}>
                        <AddNewDepartment
                            onSuccess={ () => this.fetchDepartments() }
                            employees={ this.state.employees } />
                    </Col>
                </Row>
                <DepartmentTable departments={ this.state.departments } />
            </div>
        )
    }
}

class General extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            toast: {
                text: undefined,
                style: undefined,
                show: false
            }
        };
    }

    componentDidMount() {
        GetDetails({
            onSuccess: (res) => {
                this.setState({userDetails: res, isLoading: false})
            }
        });
    }

    showToast() {
        const toast = {
            text: 'Profile updated',
            style: 'success',
            show: true
        }
        this.setState({toast: toast});
        setTimeout(() => {
            this.setState({toast: {show: false}})
        }, 8000);
    }

    render() {
        if (this.state.isLoading) {
            return (<div></div>);
        }
        return (
            <div>
                <Toast {...this.state.toast} />
                <h1>General settings</h1>
                <Row>
                    <Col sm={7}>
                        <h2>Personal Details</h2>
                        <PersonalDetailsForm userDetails={this.state.userDetails} />
                    </Col>
                </Row>

                <Row>
                    <Col sm={7}>
                        <h2>Change Password</h2>
                        <ChangePasswordForm onSuccess={() => this.showToast()} />
                    </Col>
                </Row>
            </div>
        )
    }
}

class PersonalDetailsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            isLoading: false,
            formData: {
                firstName: props.userDetails.firstName,
                lastName: props.userDetails.lastName,
                email: props.userDetails.email
            },
            showToast: false,
            toast: {
                text: undefined,
                style: undefined
            }
        };
    }

    onChange(e) {
        let formData = this.state.formData;
        formData[e.target.name] = e.target.value;
        this.setState({formData: formData});
    }

    onSubmit(e) {
        this.setState({isLoading: true});
        UpdateDetails({
            onSuccess: (res) => {
                this.setState({isLoading: false});
            },
            body: this.state.formData
        });
        e.preventDefault();
    }

    render() {
        return (
            <Form horizontal onSubmit={ this.onSubmit.bind(this) } >
                <FormField
                    type="text"
                    name="firstName"
                    value={ this.state.formData.firstName }
                    labelSize={3}
                    required
                    disabled={this.state.isLoading}
                    onChange={ this.onChange.bind(this) }
                >
                    First name
                </FormField>

                <FormField
                    type="text"
                    name="lastName"
                    value={ this.state.formData.lastName }
                    labelSize={3}
                    required
                    disabled={this.state.isLoading}
                    onChange={ this.onChange.bind(this) }
                >
                    Last name
                </FormField>

                <FormField
                    type="text"
                    name="email"
                    value={ this.state.formData.email }
                    labelSize={3}
                    required
                    disabled={this.state.isLoading}
                    onChange={ this.onChange.bind(this) }
                >
                    Email
                </FormField>

                <FormGroup>
                    <Col sm={8} smOffset={3}>
                        <FormButton
                            isLoading={ this.state.isLoading }
                            bsStyle="success">Update profile</FormButton>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

export class ChangePasswordForm  extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            isLoading: false,
            formData: {
                password: undefined,
                retryPassword: undefined
            },
            errors: {
                password: undefined
            }
        }
    }

    onChange(e) {
        let formData = this.state.formData;
        formData[e.target.name] = e.target.value;
        this.setState({formData: formData});
    }

    onSubmit(e) {
        if (this.validateForm()) {
            this.setState({isLoading: true});
            UpdateDetails({
                onSuccess: () => {
                    this.setState(this.getInitialState(), () => {
                        this.props.onSuccess();
                    })
                },
                onError: (json) => {
                    let errors = {};
                    for (const key in json.errors) {
                        errors[key] = json.errors[key].defaultMessage
                    }
                    this.setState({
                        errors: errors,
                        isLoading: false
                    });
                },
                body: {
                    password: this.state.formData.password
                }
            });
        }
        e.preventDefault();
    }

    validateForm() {
        if (this.state.formData.password !== this.state.formData.retryPassword) {
            this.setState({errors: {password: 'Passwords do not match'}});
            return false;
        } else {
            this.setState({errors: {password: undefined}});
            return true;
        }
    }

    render() {
        return (
            <Form horizontal onSubmit={ this.onSubmit.bind(this) }>

                <FormField
                    type="password"
                    name="password"
                    required
                    labelSize={3}
                    onChange={ this.onChange.bind(this) }
                    error={ this.state.errors.password }
                >
                    New password
                </FormField>

                <FormField
                    type="password"
                    name="retryPassword"
                    labelSize={3}
                    onChange={ this.onChange.bind(this) }
                >
                    Confirm
                </FormField>

                <FormGroup>
                    <Col sm={8} smOffset={3}>
                        <FormButton
                            isLoading={ this.state.isLoading }
                            bsStyle="success">Change password</FormButton>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

export class AddNewDepartment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            isLoading: false,
            formData: {
                name: undefined,
                boss: undefined,
                daysOff: undefined
            },
            showToast: false,
            toast: {
                text: undefined,
                style: undefined
            }
        };
    }

    onChange(e) {
        let formData = this.state.formData;
        formData[e.target.name] = e.target.value;
        this.setState({formData: formData});
    }

    onSubmit(e) {
        this.setState({isLoading: true});
        CreateDepartment({
            onSuccess: () => {
                this.setState({
                    isLoading: false,
                    show: false,
                    toast: {
                        text: "Created!",
                        style: "success"
                    }
                }, () => {
                    this.props.onSuccess();
                    this.setState({show: false});
                    this.showToast();
                })
            },
            onError: () => {
                // TODO unhandlered error
                this.setState({isLoading: false});
            },
            body: {
                name: this.state.formData.name,
                boss: this.state.formData.boss,
                daysOff: this.state.formData.daysOff
            }
        });
        e.preventDefault();
    }

    showToast() {
        this.setState({showToast: true});
        setTimeout(() => {
            this.setState({showToast: false})
        }, 8000);
    }

    render() {
        const {formData, isLoading, showToast, toast, show} = this.state;

        return (
            <div>
                <Toast text={toast.text} show={showToast} style={toast.style} />
                <Modal show={show} onHide={() => this.setState({show: false})}>
                    <Form onSubmit={ this.onSubmit.bind(this) } method="post" autoComplete="off">
                        <Modal.Header closeButton>
                            <Modal.Title>Add new</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <ControlLabel>Name</ControlLabel>
                                        <FormControl
                                            type="text"
                                            name="name"
                                            value={ formData.starting }
                                            onChange={ this.onChange.bind(this) }
                                            disabled={ isLoading }
                                            required />
                                    </FormGroup>
                                </Col>

                                <Col md={12}>
                                    <FormGroup>
                                        <ControlLabel>Boss</ControlLabel>
                                        <FormControl
                                            name="boss"
                                            componentClass="select"
                                            placeholder="select"
                                            onChange={ this.onChange.bind(this) }
                                            disabled={ isLoading }
                                            required>
                                                <option value=""></option>
                                            { this.props.employees.map((d, i) => {
                                                return (<option
                                                    key={d.uid}
                                                    value={d.uid}
                                                >{ d.firstName } { d.lastName }</option>)
                                            })}
                                        </FormControl>
                                    </FormGroup>
                                </Col>

                                <Col md={12}>
                                    <ControlLabel>Allowance</ControlLabel>
                                    <FormControl
                                        type="number"
                                        name="daysOff"
                                        min="0"
                                        step="0.5"
                                        onChange={ this.onChange.bind(this) }
                                        disabled={ isLoading }
                                        required />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.props.close} disabled={ isLoading } >Close</Button>
                            <FormButton isLoading={ isLoading } bsStyle="success">Add</FormButton>
                        </Modal.Footer>
                    </Form>
                </Modal>

               <Button bsStyle="primary"
                    className="pull-right"
                    onClick={() => this.setState({show: true})}>Add new</Button>
            </div>
        )
    }
}


export class Settings extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/settings/department' component={Department} />
                <Route path='/settings/general' component={General} />
                <Route component={Signpost} />
            </Switch>
        )
    }
}


export class DepartmentTable extends React.Component {

    render() {
        const {departments} = this.props;
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Boss</th>
                        <th>Allowance (days)</th>
                    </tr>
                </thead>

                <tbody>
                    { departments.map((d, i) => {
                        return (
                            <tr key={"dep-" + i}>
                                <td>{ d.name }</td>
                                <td>{ d.boss.label }</td>
                                <td>{ d.daysOff }</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}
