import React from "react";

import {MenuItem, SplitButton, Table, Media, Badge, Pager, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl, InputGroup, DropdownButton} from "react-bootstrap";

import SessionManager from "./../services/Session.jsx";
import {GetDepartment} from '../api/Companies'
import {GetDepartmentEmployees} from '../api/Employees'
import {Gravatar} from '../components/Gravatar'
import {FieldGroup} from "../forms/FormField.jsx";
import FormButton from "../forms/FormButton.jsx";


export class Employees extends React.Component {

    constructor(props) {
        super(props);

        let firstDay = new Date();
        let lastDay = new Date();
        lastDay.setDate(lastDay.getDate() + 30)

        this.state = {
            showBookTimeOffModal: false,
            selectedDepartment: null,
            departments: [],
            employees: [],
            firstDay: firstDay,
            lastDay: lastDay,
        };
    }

    componentDidMount() {
        let user = SessionManager.get();
        GetDepartment(user.getCompanyId(), {onSuccess: this.pupulateListOfDepartments.bind(this)})
    }

    pupulateListOfDepartments(response) {
        let departments = response.map(d => {
            return {name: d.name, uid: d.uid}
        });
        this.setState({departments: departments}, this.departmentChange(departments[0]));
    }

    pupulateListOfEmployees(response) {
        this.setState({employees: response});
    }

    loadEmployees(departmentId) {
        let user = SessionManager.get();
        GetDepartmentEmployees(user.getCompanyId(), departmentId, {onSuccess: this.pupulateListOfEmployees.bind(this)});
    }

    departmentChange(d) {
        this.setState({selectedDepartment: d});
        this.loadEmployees(d.uid);
    }

    changeMonth(step) {
        let firstDay = new Date(this.state.firstDay.getFullYear(), this.state.firstDay.getMonth() + step, 1);
        let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

        this.setState({
            firstDay: firstDay,
            lastDay: lastDay
        })
    }

    render() {
        return (
            <div>
                { this.state.showBookTimeOffModal && <BookTimeOffModal close={() => this.setState({showBookTimeOffModal: false})} /> }
                <Button bsStyle="primary" className="pull-right" onClick={() => this.setState({showBookTimeOffModal: true})}>Book time off</Button>

                <h1>Your company</h1>
                <Row className="employeeHeader">
                    <Col md={2}>
                        { this.state.selectedDepartment ?
                            <SplitButton title={this.state.selectedDepartment.name} id="departments">
                               { this.state.departments.map((d, i) => {
                                    return (<MenuItem
                                        key={d.uid}
                                        eventKey={d.uid}
                                        onSelect={this.departmentChange.bind(this, d)}
                                    >{d.name}</MenuItem>)
                                })}
                            </SplitButton>
                            : null
                        }
                    </Col>
                    <Col md={10}>
                        <Pager>
                            <Pager.Item previous href="#" onClick={this.changeMonth.bind(this, -1)}>&larr; Previous</Pager.Item>
                            <Pager.Item next href="#" onClick={this.changeMonth.bind(this, 1)}>Next &rarr;</Pager.Item>
                        </Pager>
                    </Col>
                </Row>

                <EmployeesTable
                    employees={this.state.employees}
                    firstDay={this.state.firstDay}
                    lastDay={this.state.lastDay} />
            </div>
        )
    }
}


class EmployeesTable extends React.Component {

    localizeMonth(date) {
        return date.toLocaleString("en-us", {month: "short"});
    }

    calculateDays(firstDay, lastDay) {
        let days = [];
        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        return days;
    }

    render() {
        let days = this.calculateDays(this.props.firstDay, this.props.lastDay);

        return (
            <Table responsive className="employees">
                <thead>
                    <tr>
                        <td></td>
                        <td style={{padding: 0}}><DaysHeader days={days} /></td>
                    </tr>
                </thead>

                <tbody>
                    { this.props.employees.map((e, i) => {
                        return (
                            <tr key={"emp" + i}>
                                <th className="person">
                                    <Media>
                                        <Media.Left>
                                            <Badge>42 <small>&#189;</small></Badge>
                                            <Gravatar email={ e.email } />
                                        </Media.Left>
                                        <Media.Body>
                                            <Media.Heading>{ e.firstName } { e.lastName }</Media.Heading>
                                            <p>{ e.department }</p>
                                        </Media.Body>
                                    </Media>
                                </th>
                                <td style={{padding: 0}}><Days days={days} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}

class DaysHeader extends React.Component {

    localizeDayOfWeek(date) {
        return date.toLocaleString("en-us", {weekday: "short"})[0];
    }

    render() {
        return (
            <Table>
                <tbody>
                    <tr>
                        { this.props.days.map((d, i) => {
                            let clazz = d.toLocaleDateString() === new Date().toLocaleDateString() ? "today day" : "day";
                            return (<td className={clazz} key={i}><div className="content">{ this.localizeDayOfWeek(d) }</div></td>)
                        })}
                    </tr>
                </tbody>
            </Table>
        )
    }
}

class Days extends React.Component {
    render() {
        return (
            <Table>
                <tbody>
                    <tr>
                        { this.props.days.map((d, i) => {
                            let clazz = d.getDay() in [4, 5] ? "wd day" : "nwd day";
                            return (
                                <td className={clazz} key={i}>
                                    <div className="content">{ d.getDate() }</div>
                                    <div className="first"></div>
                                    <div className="second"></div>
                                </td>
                            )
                        })}
                    </tr>
                </tbody>
            </Table>
        )
    }
}

class BookTimeOffModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    render() {
        return (
        <Form onSubmit={this.onSubmit} method="post" autoComplete="off">
            <Modal show={true} onHide={this.props.close} className="requestTimeOffModal">
                <Modal.Header closeButton>
                    <Modal.Title>Request time off</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FieldGroup
                        id="formControlsText"
                        type="text"
                        label="Type"
                        placeholder="Type"
                    />
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <ControlLabel>Starting</ControlLabel>
                                <InputGroup>
                                    <FormControl type="date" />
                                    <DropdownButton
                                      componentClass={InputGroup.Button}
                                      id="input-dropdown-addon"
                                      title="Morning"
                                    >
                                    <MenuItem key="1">Morning</MenuItem>
                                    <MenuItem key="2">Afternoon</MenuItem>
                                </DropdownButton>
                              </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <ControlLabel>Ending</ControlLabel>
                                <InputGroup>
                                    <FormControl type="date" />
                                    <DropdownButton
                                      componentClass={InputGroup.Button}
                                      id="input-dropdown-addon"
                                      title="Lunchtime"
                                    >
                                    <MenuItem key="1">Lunchtime</MenuItem>
                                    <MenuItem key="2">End of Day</MenuItem>
                                </DropdownButton>
                              </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Reason</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Reason for time off" />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                    <FormButton isLoading={ this.state.isLoading } bsStyle="success">Send request</FormButton>
                </Modal.Footer>
            </Modal>
        </Form>
        );
    }
}
