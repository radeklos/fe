import React from "react";

import {Checkbox, Form, FormGroup} from "react-bootstrap";
import FormButton from "../forms/FormButton.jsx";
import SimpleFormField from "../forms/SimpleFormField.jsx";
import {CreateCompany} from "../api/Companies.jsx";


class CompanyForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            errors: {},
            isLoading: false
        };
    }

    onFormError(json) {
        let errors = {};
        for (let key in json.errors) {
            errors[key] = json.errors[key].defaultMessage;
        }
        this.setState({
            errors: errors,
            isLoading: false
        })
    }

    onSubmit(e) {
        this.setState({
            isLoading: true
        });

        CreateCompany({
            body: {
                name: this.state.data.name,
                regNo: this.state.data.regNo,
                vatId: this.state.data.vatId,
                paysVat: this.state.data.paysVat,
                address1: this.state.data.address1,
                address2: this.state.data.address2,
                city: this.state.data.city,
                postcode: this.state.data.postcode,
                defaultDaysOff: this.state.data.defaultDaysOff,
            },
            onSuccess: this.props.onFormSuccess.bind(this),
            onError: this.onFormError.bind(this)
        });
        e.preventDefault();
    }

    onChange(e) {
        let data = this.state.data;
        let errors = this.state.errors;
        data[e.target.name] = e.target.value;
        delete errors[e.target.name];
        this.setState({
            data: data,
            errors: errors
        })
    }

    render() {
        return (
            <Form horizontal onSubmit={this.onSubmit.bind(this)} method="post" autoComplete="off">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-5">
                            <SimpleFormField
                                type="text"
                                name="name"
                                placeholder="Google, Amazon, Facebook"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.name }>Name</SimpleFormField>

                            <SimpleFormField
                                type="text"
                                name="regNo"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.regNo }>Reg. No</SimpleFormField>

                            <SimpleFormField
                                type="text"
                                name="vatId"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.vatId }>Vat ID
                            </SimpleFormField>

                            <FormGroup>
                                <Checkbox name="paysVat" onChange={ this.onChangeCheckbox } inline>Pays Vat</Checkbox>
                            </FormGroup>

                        </div>

                        <div className="col-md-6 col-md-offset-1">

                            <SimpleFormField
                                type="text"
                                name="address1"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.address1 }>Address</SimpleFormField>

                            <SimpleFormField
                                type="text"
                                name="address2"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.address2 }>Address 2</SimpleFormField>

                            <SimpleFormField
                                type="text"
                                name="city"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.city }>City</SimpleFormField>

                            <SimpleFormField
                                type="text"
                                name="postcode"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.postcode }>Postcode</SimpleFormField>
                        </div>
                    </div>

                    <div className="row">
                        <hr />
                        <div className="col-md-5">
                            <SimpleFormField
                                type="number"
                                min="0"
                                name="defaultDaysOff"
                                onChange={ this.onChange.bind(this) }
                                error={ this.state.errors.defaultDaysOff }>The holiday entitlement for the full
                                year</SimpleFormField>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <FormButton isLoading={ this.state.isLoading }>Create</FormButton>
                            </div>
                        </div>

                    </div>
                </div>
            </Form>
        );
    }
}

export default CompanyForm;
