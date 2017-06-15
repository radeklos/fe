import React from "react";

import {MenuItem, SplitButton, Table, Media, Badge, Pager, Button, Row, Col} from "react-bootstrap";

import SessionManager from "./../services/Session.jsx";
import {GetDepartment} from '../api/Companies'
import {GetDepartmentEmployees} from '../api/Employees'
import {Gravatar} from '../components/Gravatar'


export class Employees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDepartment: null,
            departments: [],
            employees: []
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

    render() {
        return (
            <div>
                <Button bsStyle="primary" className="pull-right">Book time off</Button>
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
                            <Pager.Item previous href="#">&larr; Previous</Pager.Item>
                            <Pager.Item next href="#">Next &rarr;</Pager.Item>
                        </Pager>
                    </Col>
                </Row>

                <EmployeesTable employees={this.state.employees} />
            </div>
        )
    }
}


class EmployeesTable extends React.Component {

    localizeMonth(date) {
        return date.toLocaleString("en-us", {month: "short"});
    }

    localizeDayOfWeek(date) {
        return date.toLocaleString("en-us", {weekday: "short"})[0];
    }

    render() {
        let firstDate = new Date();
        let lastDay = new Date();
        lastDay.setDate(lastDay.getDate() + 30)
        let daysOfYear = [];
        let month = {};
        for (let d = firstDate; d <= lastDay; d.setDate(d.getDate() + 1)) {
            daysOfYear.push(new Date(d));
            let monthName = this.localizeMonth(d);
            if (!month[monthName]) {
                month[monthName] = 0;
            }
            month[monthName] += 1;
        }

        return (
            <Table responsive className="employees">
                <thead>

                    <tr>
                        <td></td>
                        { daysOfYear.map((d, i) => {
                            let isToday = d.toLocaleDateString() === new Date().toLocaleDateString();
                            return (<td className="day" key={i}><div className={isToday ? "today" : ""}>{ this.localizeDayOfWeek(d) }</div></td>)
                        })}
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
                                { daysOfYear.map((d, i) => {
                                    let clazz = d.getDay() in [5, 6] ? "wd day" : "nwd day";
                                    return (<td className={clazz} key={e.email + i}>{ d.getDate() }</td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}
