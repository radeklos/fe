import React from "react";
import {Button, ButtonToolbar, Col, Form, FormControl, FormGroup, Modal, Table} from "react-bootstrap";
import PropTypes from "prop-types";
import {config} from "../config";
import {ImportEmployees} from "../api/Employees"
import SessionManager from "../services/Session.jsx";


export class EditEmployees extends React.Component {

    render() {

        const employees = [
            {id: 1, firstName: "Radek", lastName: "Los", department: "IT"},
        ];

        return (
            <div>
                <h1>Employees</h1>
                <EmployeeTable employees={employees}/>
                <ImportControllers />
            </div>
        )
    }
}

class ImportControllers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: true
        }
    }

    open() {
        this.setState({showModal: true});
    }

    render() {
        return (
            <div className="pull-right">
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={ this.open.bind(this) }>Import employees</Button>
                </ButtonToolbar>
            </div>
        )
    }
}

export class ImportEmployeesModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.open
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showModal: nextProps.open});
    }

    closeModal() {
        this.setState({showModal: false});
    }

    performImportEmployees(e) {
        ImportEmployees(
            SessionManager.get().getCompanyId(),
            this.state.files[0],
            {file: this.state.file}
        );
        e.preventDefault();
    }

    fileHandleChange(e) {
        this.setState({file: e.target.files[0].result});
    }

    downloadExample() {
        window.location = config.SERVER_URL + '/v1/companies/examples/employees';
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                <Form horizontal onSubmit={this.performImportEmployees.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Import employees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Upload a CSV file to import a new employees directory.</p>

                        <FormGroup controlId="formHorizontalFile">
                            <Col sm={12}>
                                <FormControl
                                    type="file"
                                    placeholder="file"
                                    accept=".csv"
                                    onChange={this.fileHandleChange.bind(this)}/>
                            </Col>
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="link" onClick={this.downloadExample.bind(this)}>Download example</Button>
                        <Button onClick={this.closeModal.bind(this)}>Close</Button>
                        <Button bsStyle="success" type="submit">Import</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

class EmployeeTable extends React.Component {

    static renderEmployeeRow(row) {
        return (
            <tr key={ row.id }>
                <td>{ row.firstName }</td>
                <td>{ row.lastName }</td>
                <td>{ row.department }</td>
            </tr>
        )
    }

    render() {
        return (
            <Table responsive>
                <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Department</th>
                </tr>
                </thead>
                <tbody>
                { this.props.employees.map(EmployeeTable.renderEmployeeRow.bind(this)) }
                </tbody>
            </Table>
        )
    }
}

EmployeeTable.propTypes = {
    employees: PropTypes.array
};

