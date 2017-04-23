import React from "react";
import {Button, ButtonToolbar, Col, Form, FormControl, FormGroup, Modal, Table} from "react-bootstrap";
import PropTypes from "prop-types";
import {config} from "../config";


export class ImportEmployees extends React.Component {

    render() {

        const employees = [
            {id: 1, firstName: "Radek", lastName: "Los", department: "IT"},
        ];

        return (
            <div>
                <h1>Import employees</h1>

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
                <ImportEmployeesModal />
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

    close() {
        this.setState({showModal: false});
    }

    downloadExample() {
        window.location = config.SERVER_URL + '/v1/companies/examples/employees';
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Import employees</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Upload a CSV file to import a new employees directory.</p>

                    <Form horizontal>
                        <FormGroup controlId="formHorizontalFile">
                            <Col sm={12}>
                                <FormControl type="file" placeholder="file" accept=".csv"/>
                            </Col>
                        </FormGroup>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="link" onClick={this.downloadExample.bind(this)}>Download example</Button>
                    <Button onClick={this.close.bind(this)}>Close</Button>
                    <Button bsStyle="success">Import</Button>
                </Modal.Footer>
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

