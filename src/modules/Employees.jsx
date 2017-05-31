import React from "react";

import {MenuItem, SplitButton, Table, Media, Badge, Pager} from "react-bootstrap";

import SessionManager from "./../services/Session.jsx";
import {GetDepartment} from '../api/Companies'
import {Gravatar} from '../components/Gravatar'


export class Employees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDepartment: 0,
            departments: [{uid: 1, name: 'HR'}],
            employees: [
                {firstName: 'Radek', lastName: 'Los', department: 'HR', email: 'radek.los@gmail.com'},
                {firstName: 'Lucie', lastName: 'Svobodova', department: 'HR', email: 'lucie.svobodova@gmail.com'},
                {firstName: 'Radek', lastName: 'Los', department: 'HR', email: 'radek.los@gmail.com'},
                {firstName: 'Radek', lastName: 'Los', department: 'HR', email: 'radek.los@gmail.com'},
                {firstName: 'Radek', lastName: 'Los', department: 'HR', email: 'radek.los@gmail.com'}
            ]
        };
    }

    componentWillMount() {
        let user = SessionManager.get();
        GetDepartment(user.getCompanyId(), {onSuccess: this.pupulateListOfDepartments})
    }

    pupulateListOfDepartments(response) {
        let departments = response.map(d => {
            return {name: d.name, uid: d.uid}
        });
        this.setState({departments: departments});
    }

    localizeMonth(date) {
        return date.toLocaleString("en-us", {month: "short"});
    }

    localizeDayOfWeek(date) {
        return date.toLocaleString("en-us", {weekday: "short"})[0];
    }

    render() {
        let selected = this.state.departments[this.state.selectedDepartment];

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
            <div>
                <Table responsive style={{marginTop: "1em"}} className="employees">
                <thead>
                    <tr>
                        <td>
                            <SplitButton title={selected.name}>
                               { this.state.departments.map(d => {
                                    return (<MenuItem key={d.uid}>{d.name}</MenuItem>)
                                })}
                            </SplitButton>
                        </td>
                        <td colSpan="31">
                            <Pager>
                                <Pager.Item previous href="#">&larr; Previous</Pager.Item>
                                <Pager.Item next href="#">Next &rarr;</Pager.Item>
                            </Pager>
                        </td>
                    </tr>

                    <tr>
                        <td>

                        </td>
                        { daysOfYear.map(d => {
                            let isToday = d.toLocaleDateString() === new Date().toLocaleDateString();
                            return (<td className="day"><div className={isToday ? "today" : ""}>{ this.localizeDayOfWeek(d) }</div></td>)
                        })}
                    </tr>
                </thead>

                <tbody>
                    { this.state.employees.map(e => {
                        return (
                            <tr>
                                <th className="person">
                                    <Media>
                                        <Media.Left>
                                            <Badge>42</Badge>
                                            <Gravatar email={ e.email } />
                                        </Media.Left>
                                        <Media.Body>
                                            <Media.Heading>{ e.firstName } { e.lastName }</Media.Heading>
                                            <p>{ e.department }</p>
                                        </Media.Body>
                                    </Media>
                                </th>
                                { daysOfYear.map(d => {
                                    let clazz = d.getDay() in [5, 6] ? "wd day" : "nwd day";
                                    return (<td className={clazz} >{ d.getDate() }</td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
              </Table>
            </div>
        )
    }
}
