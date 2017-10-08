import React from "react";

import {MenuItem, SplitButton, Table, Media, Badge, Pager, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl, InputGroup, DropdownButton, Image} from "react-bootstrap";

import plus from "../images/plus.svg";

import {Gravatar} from '../components/Gravatar'
import {Toast} from '../components/Toast'
import FormButton from "../forms/FormButton.jsx";
import {GetLeaves, CreateLeave} from "../api/Leaves";
import {GetDepartment} from '../api/Companies'
import {CreateNewEmployee} from '../api/Employees'


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

        this.departmentItemAll = {uid: null, label: 'All departments'};
        this.state = {
            showBookTimeOffModal: false,
            selectedDepartment: this.departmentItemAll,
            departments: [],
            employees: [],
            firstDay: firstDay,
            lastDay: lastDay,
            show: false
        };
    }

    componentDidMount() {
        this.getLeaves();
    }

    getLeaves() {
        GetLeaves({onSuccess: this.pupulateListOfEmployees.bind(this)}, formatDate(this.state.firstDay), formatDate(this.state.lastDay));
    }

    pupulateListOfEmployees(response) {
        const unique = [];
        const department = [this.departmentItemAll, ...response.items.map(e => {
            return {label: e.department.label, uid: e.department.uid}
        })].filter((item, index, inputArray) => {  // make it unique
            if (unique.indexOf(item.uid) !== -1) {
                return false;
            }
            unique.push(item.uid)
            return true;
        })
        this.setState({
            employees: response.items,
            departments: department
        });
    }

    departmentChange(d) {
        this.setState({selectedDepartment: d});
    }

    changeMonth(step) {
        const firstDay = new Date(this.state.firstDay.getFullYear(), this.state.firstDay.getMonth() + step, 1);
        const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
        this.setState({
            firstDay: firstDay,
            lastDay: lastDay
        })
    }

    localizeMonth(date) {
        return date.toLocaleString("en-us", {month: "long"});
    }

    filterEmployoeesOnlyInDepartment(e) {
        return (this.state.selectedDepartment.uid == null) ||
            (e.department && e.department.uid === this.state.selectedDepartment.uid);
    }

    render() {
        let showSecondMonth = this.state.firstDay.getMonth() !== this.state.lastDay.getMonth();
        let showYear = (new Date()).getFullYear() !== this.state.lastDay.getFullYear()

        return (
            <div>
                <BookTimeOffModal
                    show={this.state.showBookTimeOffModal}
                    close={() => this.setState({showBookTimeOffModal: false})}
                    onSuccess={() => this.getLeaves() } />

                <Button bsStyle="primary"
                    className="pull-right"
                    onClick={() => this.setState({showBookTimeOffModal: true})}>Book time off</Button>

                <h1>Your company</h1>
                <Row className="employeeHeader">
                    <Col md={2}>
                        { this.state.selectedDepartment ?
                            <SplitButton title={this.state.selectedDepartment.label} id="departments">
                               { this.state.departments.map((d, i) => {
                                    return (<MenuItem
                                        key={d.uid}
                                        eventKey={d.uid}
                                        onSelect={this.departmentChange.bind(this, d)}
                                    >{d.label}</MenuItem>)
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
                    employees={this.state.employees.filter(this.filterEmployoeesOnlyInDepartment.bind(this))}
                    firstDay={this.state.firstDay}
                    lastDay={this.state.lastDay} />
                <AddNewEmployee />
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
            return (<Badge>{rounded === 0 ? "" : rounded} <small>&#189;</small></Badge>);  // 1/2
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
                            <tr key={'emp' + i}>
                                <th className="person">
                                    <Media>
                                        <Media.Left>
                                            { this.parseBadge(e.remaining) }
                                            <Gravatar email={ person.email } />
                                        </Media.Left>
                                        <Media.Body>
                                            <Media.Heading>{ person.firstName } { person.lastName }</Media.Heading>
                                            <p>{ e.department && e.department.label }</p>
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

    isOffStarting(_date, timeoff) {
        const date = new Date(_date);
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

    isOffEnding(_date, timeoff) {
        const date = new Date(_date);
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

class AddNewEmployee extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            toast: {
                style: undefined,
                text: undefined,
            },
            data: {},
            errors: {},
            show: false,
            departments: [],
            formData: {
                firstname: undefined,
                lastname: undefined,
                email: undefined,
                department: undefined,
                startDate: undefined,
            }
        }
    }

    componentDidMount() {
        GetDepartment({onSuccess: this.pupulateListOfDepartments.bind(this)});
    }

    pupulateListOfDepartments(response) {
        let departments = response.items.map(d => {
            return {name: d.name, uid: d.uid}
        });
        if (departments.length > 0) {
            this.setState({departments: departments});
       }
    }

    onChange(e) {
        let formData = this.state.formData;
        formData[e.target.name] = e.target.value;
        this.setState({formData: formData});
    }

    close() {
        this.setState({show: false});
    }

    onSubmit(e) {
        CreateNewEmployee(
            this.state.formData.department,
            {
                onSuccess: () => {
                    this.close();
                    this.showToast("Invitation sent!", "success");
                },
                onError: () => {
                    // TODO unhandlered error
                    this.setState({isLoading: false});
                }
            }, {
                firstName: this.state.formData.firstname,
                lastName: this.state.formData.lastname,
                email: this.state.formData.email,
                startedAt: this.state.formData.startDate
            });
        e.preventDefault();
    }

    showToast(text, style) {
        this.setState({
            showToast: true,
            toast: {
                style: style,
                text: text,
            }});
        setTimeout(() => {
            this.setState({showToast: false})
        }, 8000);
    }

    render() {
        const {isLoading, toast, showToast} = this.state;

        return (
            <div>
                <Toast text={toast.text} show={showToast} style={toast.style} />
                <Modal show={this.state.show} onHide={ this.close.bind(this) } className="requestTimeOffModal">
                    <Form horizontal onSubmit={ this.onSubmit.bind(this) } autoComplete="off">
                        <Modal.Header closeButton>
                            <Modal.Title>Invite new user</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <ControlLabel>Firstname</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="firstname"
                                        onChange={ this.onChange.bind(this) }
                                        disabled={ isLoading }
                                        required />
                                </Col>
                                <Col md={6}>
                                    <ControlLabel>Lastname</ControlLabel>
                                    <FormControl
                                        type="text"
                                        name="lastname"
                                        onChange={ this.onChange.bind(this) }
                                        disabled={ isLoading }
                                        required />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl
                                        type="email"
                                        name="email"
                                        onChange={ this.onChange.bind(this) }
                                        disabled={ isLoading }
                                        required />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <ControlLabel>Department</ControlLabel>
                                        <FormControl
                                            name="department"
                                            componentClass="select"
                                            placeholder="select"
                                            onChange={ this.onChange.bind(this) }
                                            disabled={ isLoading }
                                            required>
                                                <option value=""></option>
                                            { this.state.departments.map((d, i) => {
                                                return (<option
                                                    key={d.uid}
                                                    value={d.uid}
                                                >{ d.name }</option>)
                                            })}
                                        </FormControl>
                                </Col>
                                <Col md={6}>
                                    <ControlLabel>Employment start date</ControlLabel>
                                    <FormControl
                                        type="date"
                                        name="startDate"
                                        onChange={ this.onChange.bind(this) }
                                        disabled={ isLoading }
                                        required />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={ this.close.bind(this) } disabled={ isLoading }>Close</Button>
                            <FormButton isLoading={ isLoading } bsStyle="success">Send invitation</FormButton>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <a href="#" onClick={() => this.setState({show: true})}>
                    <Image src={plus} circle width="25" height="25" />{" "}
                    New user
                </a>
            </div>
        );
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
            toast: {
                style: undefined,
                text: undefined,
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
                this.setState({
                    isLoading: false,
                    show: false,
                    toast: {
                        text: "Booked!",
                        style: "success"
                    }
                }, () => {
                    this.props.onSuccess();
                    this.props.close();
                    this.showToast();
                })
            },
            onError: () => {
                // TODO unhandlered error
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

    showToast() {
        this.setState({showToast: true});
        setTimeout(() => {
            this.setState({showToast: false})
        }, 8000);
    }

    render() {
        const {formData, isLoading, toast} = this.state;

        return (
            <div>
                <Toast text={toast.text} show={this.state.showToast} style={toast.style} />
                <Modal show={this.props.show} onHide={this.props.close} className="requestTimeOffModal">
                    <Form onSubmit={ this.onSubmit.bind(this) } autoComplete="off">
                        <Modal.Header closeButton>
                            <Modal.Title>Request time off</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
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
            </div>
        );
    }
}
