import React from "react";

import {MenuItem, SplitButton, Table, Media, Badge, Pager, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl, InputGroup, DropdownButton, Panel} from "react-bootstrap";

import SessionManager from "./../services/Session.jsx";
import {GetDepartment} from '../api/Companies'
import {GetDepartmentEmployees} from '../api/Employees'
import {Gravatar} from '../components/Gravatar'
import {FieldGroup} from "../forms/FormField.jsx";
import FormButton from "../forms/FormButton.jsx";
import {GetLeaves, CreateLeave} from "../api/Leaves";


const formatDate = (date) => date.toISOString().slice(0, 10);

export const calculateDays = (firstDay, lastDay) => {
    let days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }
    return days;
}


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
        GetDepartment({onSuccess: this.pupulateListOfDepartments.bind(this)});
        GetLeaves({onSuccess: this.pupulateListOfEmployees.bind(this)}, formatDate(this.state.firstDay), formatDate(this.state.lastDay));
    }

    pupulateListOfEmployees(response) {
        this.setState({employees: response.items});
    }

    pupulateListOfDepartments(response) {
        let departments = response.map(d => {
            return {name: d.name, uid: d.uid}
        });
        if (departments.length > 0) {
            this.setState({departments: departments}, this.departmentChange(departments[0]));
        }
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

    localizeMonth(date) {
        return date.toLocaleString("en-us", {month: "long"});
    }

    render() {
        let showSecondMonth = this.state.firstDay.getMonth() !== this.state.lastDay.getMonth();
        let showYear = (new Date()).getFullYear() !== this.state.lastDay.getFullYear()

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
                            <Row>
                                <Col xs={4}><Pager.Item previous href="#" onClick={this.changeMonth.bind(this, -1)}>&larr; Previous</Pager.Item></Col>
                                <Col xs={4}>
                                    <h4>
                                        { this.localizeMonth(this.state.firstDay) }{" "}
                                        { showSecondMonth ? (<small>to</small>) : ""}{" "}
                                        { showSecondMonth ? this.localizeMonth(this.state.lastDay) : "" }{" "}
                                        { showYear ? this.state.lastDay.getFullYear() : "" }
                                    </h4>
                                </Col>
                                <Col xs={4}><Pager.Item next href="#" onClick={this.changeMonth.bind(this, 1)}>Next &rarr;</Pager.Item></Col>
                            </Row>
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


export class EmployeesTable extends React.Component {

    parseBadge(num) {
        if (num === undefined) {
            return;
        }
        const rounded = Math.floor(num);
        if (rounded !== num) {
            return (<Badge>{rounded}<small>&#189;</small></Badge>);  // 1/2
        }
        return (<Badge>{rounded}</Badge>);
    }

    render() {
        let days = calculateDays(this.props.firstDay, this.props.lastDay);
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
                        const person = e.employee;
                        return (
                            <tr key={"emp" + i}>
                                <th className="person">
                                    <Media>
                                        <Media.Left>
                                            { this.parseBadge(person.remaining) }
                                            <Gravatar email={ person.email } />
                                        </Media.Left>
                                        <Media.Body>
                                            <Media.Heading>{ person.firstName } { person.lastName }</Media.Heading>
                                            <p>{ person.department }</p>
                                        </Media.Body>
                                    </Media>
                                </th>
                                <td style={{padding: 0}}><Days leaves={e.leaves} days={days} /></td>
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
                        { new Array(31).fill().map((_, i) => {
                            let day = this.props.days[i];
                            if (day !== undefined) {
                                let clazz = day.toLocaleDateString() === new Date().toLocaleDateString() ? "today day" : "day";
                                return (<td className={clazz} key={i}><div className="content">{ this.localizeDayOfWeek(day) }</div></td>);
                            } else {
                                return (<td className="day" key={i}/>);
                            }
                        })}
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export class Days extends React.Component {

    isOffStarting(date, timeoff) {
        date.setUTCHours(0, 0, 0, 0);
        const starting = new Date(timeoff.starting);
        starting.setUTCHours(0, 0, 0, 0);
        const ending = new Date(timeoff.ending);
        ending.setUTCHours(0, 0, 0, 0);

        if (starting.getTime() === date.getTime() && timeoff.startingAt === "PM") {
            return false;
        }
        return starting <= date && date <= ending;
    }

    isOffEnding(date, timeoff) {
        date.setUTCHours(0, 0, 0, 0);
        const starting = new Date(timeoff.starting);
        starting.setUTCHours(0, 0, 0, 0);
        const ending = new Date(timeoff.ending);
        ending.setUTCHours(0, 0, 0, 0);

        if (ending.getTime() === date.getTime() && timeoff.endingAt === "AM") {
            return false;
        }
        return starting <= date && date <= ending;
    }

    render() {
        const {days, leaves} = this.props;

        return (
            <Table>
                <tbody>
                    <tr>
                        { new Array(31).fill().map((_, i) => {
                            let day = days[i];
                            if (day !== undefined) {
                                let clazz = [0, 6].indexOf(day.getDay()) > -1 ? "wd day" : "nwd day";
                                let firstClassName = "first";
                                (leaves || []).forEach((_, l) => {
                                    if (this.isOffStarting(day, leaves[l])) {
                                        firstClassName += " time-off";
                                    }
                                });
                                let secondClassName = "second";
                                (leaves || []).forEach((_, l) => {
                                    if (this.isOffEnding(day, leaves[l])) {
                                        secondClassName += " time-off";
                                    }
                                });
                                return (
                                    <td className={clazz} key={i}>
                                        <div className="content">{ day.getDate() }</div>
                                        <div className={ firstClassName }></div>
                                        <div className={ secondClassName }></div>
                                    </td>
                                )
                            } else {
                                return (<td className="day" key={i} />);
                            }
                        })}
                    </tr>
                </tbody>
            </Table>
        )
    }
}


class BookTimeOffModal extends React.Component {

    static amPm = {
        starting: {
            am: 'Morning',
            pm: 'Afternoon'
        },
        ending: {
            pm: 'Lunchtime',
            am: 'End of Day'
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            formData: {
                startingAt: 'am',
                endingAt: 'am',
                starting: formatDate(new Date()),
                ending: undefined
            },
            now: new Date()
        }
        this.ampmChange = this.ampmChange.bind(this);
    }

    ampmChange(eventKey, ampm) {
        let formData = this.state.formData;
        formData[eventKey] = ampm
        this.setState({formData: formData});
    }

    onChange(e) {
        let formData = this.state.formData;
        let value = e.target.value;
        if (value instanceof Date) {
            value = formatDate(value);
        }
        formData[e.target.name] = e.target.value;
        this.setState({formData: formData});
    }

    onSubmit(e) {
        this.setState({isLoading: true});
        CreateLeave({
            onSuccess: () => {
                this.setState({isLoading: false});
            },
            onError: () => {
                this.setState({isLoading: false});
            }
        }, {
            leaveType: this.state.formData.leaveType,
            startingAt: this.state.formData.startingAt,
            starting: this.state.formData.starting,
            endingAt: this.state.formData.endingAt,
            ending: this.state.formData.ending,
            reason: this.state.formData.reason,
        });
        e.preventDefault();
    }

    render() {
        const {formData, isLoading} = this.state;

        return (
            <Modal show={true} onHide={this.props.close} className="requestTimeOffModal">
                <Form onSubmit={ this.onSubmit.bind(this) } method="post" autoComplete="off">
                    <Modal.Header closeButton>
                        <Modal.Title>Request time off</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Panel header={'title'} bsStyle="success" />

                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Type"
                            placeholder="Type"
                            disabled={ isLoading }
                            onChange={ this.onChange.bind(this) }
                        />
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>Starting</ControlLabel>
                                    <InputGroup>
                                        <FormControl
                                            type="date"
                                            name="starting"
                                            value={ formData.starting }
                                            onChange={ this.onChange.bind(this) }
                                            disabled={ isLoading }
                                            required />
                                        <DropdownButton
                                          componentClass={InputGroup.Button}
                                          id="input-dropdown-addon"
                                          disabled={ isLoading }
                                          title={ BookTimeOffModal.amPm.starting[formData.startingAt] }
                                        >
                                            <MenuItem eventKey="am" onSelect={ this.ampmChange.bind(this, 'startingAt') }>Morning</MenuItem>
                                            <MenuItem eventKey="pm" onSelect={ this.ampmChange.bind(this, 'startingAt') }>Afternoon</MenuItem>
                                        </DropdownButton>
                                  </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>Ending</ControlLabel>
                                    <InputGroup>
                                        <FormControl
                                            type="date"
                                            name="ending"
                                            value={ formData.ending }
                                            onChange={ this.onChange.bind(this) }
                                            disabled={ isLoading }
                                            min={ formData.starting }
                                            required />
                                        <DropdownButton
                                          componentClass={InputGroup.Button}
                                          id="input-dropdown-addon"
                                          disabled={ isLoading }
                                          title={ BookTimeOffModal.amPm.ending[formData.endingAt] }
                                        >
                                            <MenuItem eventKey="pm" onSelect={ this.ampmChange.bind(this, 'endingAt') }>Lunchtime</MenuItem>
                                            <MenuItem eventKey="am" onSelect={ this.ampmChange.bind(this, 'endingAt') }>End of Day</MenuItem>
                                        </DropdownButton>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>Reason</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                placeholder="Reason for time off"
                                name="reason"
                                onChange={ this.onChange.bind(this) }
                                disabled={ isLoading } />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.close} disabled={ isLoading } >Close</Button>
                        <FormButton isLoading={ isLoading } bsStyle="success">Send request</FormButton>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}
