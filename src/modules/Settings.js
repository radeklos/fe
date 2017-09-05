import React from 'react';

import {Table, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl} from "react-bootstrap";

import {Route, Switch} from "react-router-dom";
import {Link} from 'react-router-dom'
import {GetDepartment, GetCompanyEmployees, CreateDepartment} from "../api/Companies.jsx";
import FormButton from "../forms/FormButton.jsx";
import {Toast} from '../components/Toast'


class Signpost extends React.Component {
    render() {
        return (
            <div>
                <h1>Settings</h1>
                <Row>
                    <Col md={6}>
                        <h2>General Settings</h2>
                    </Col>
                    <Col md={6}>
                        <h2><Link to="/settings/department">Department</Link></h2>
                    </Col>
                </Row>
            </div>
        )
    }
}


export class Department extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoading: false,
            employees: []
        };
    }

    componentDidMount() {
        this.fetchEmployees();
    }

    populateEmployees(response) {
        if(response.total >= 1) {
            this.setState({employees: response.items})
        }
    }

    fetchEmployees() {
        GetCompanyEmployees({onSuccess: this.populateEmployees.bind(this)});
    }

    render() {
        return (
            <div>
                <h1>Department</h1>
                <Row>
                    <Col md={12}>
                        <AddNewDepartment
                            onSuccess={() => this.fetchDepartments()}
                            employees={ this.state.employees } />
                    </Col>
                </Row>
                <DepartmentTable />
            </div>
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
                <Route component={Signpost} />
            </Switch>
        )
    }
}


export class DepartmentTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            departments: [],
        };
    }

    componentDidMount() {
        GetDepartment({onSuccess: this.pupulateListOfDepartments.bind(this)});
    }

    pupulateListOfDepartments(response) {
        if(response.total >= 1) {
            this.setState({departments: response.items})
        }
    }

    render() {
        const {departments} = this.state;
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
