import React from "react";
import {Button, ButtonToolbar, Col, Form, FormControl, FormGroup, Modal, Table} from "react-bootstrap";
import PropTypes from "prop-types";


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

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    render() {
        const downloadExample = (<Button bsStyle="link">Download example</Button>);

        const modal = (
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
                    { downloadExample }
                    <Button onClick={this.close}>Close</Button>
                    <Button bsStyle="success">Import</Button>
                </Modal.Footer>
            </Modal>
        );

        return (
            <div className="pull-right">
                { modal }
                <ButtonToolbar>
                    { downloadExample }
                    <Button bsStyle="primary" onClick={ this.open.bind(this) }>Import employees</Button>
                </ButtonToolbar>
            </div>
        )
    }
}

class EmployeeTable extends React.Component {

    renderEmployeeRow(row) {
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
                { this.props.employees.map(this.renderEmployeeRow.bind(this)) }
                </tbody>
            </Table>
        )
    }
}

EmployeeTable.propTypes = {
    employees: PropTypes.array
};

