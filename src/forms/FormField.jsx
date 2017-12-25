import React from "react";
import {Col, ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";


export default class FormField extends React.Component {

    onChange(e) {
        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    onBlur(e) {
        if (this.props.onBlur) {
            this.props.onBlur(e)
        }
    }

    render() {
        return (
            <FormGroup validationState={ this.props.error ? "error" : undefined }>
                <Col componentClass={ControlLabel} sm={this.props.labelSize}>{ this.props.children }</Col>
                <Col sm={this.props.inputSize}>
                    <FormControl
                        type={ this.props.type }
                        id={ this.props.name }
                        name={ this.props.name }
                        value={ this.props.value }
                        placeholder={ this.props.placeholder }
                        onChange={ this.onChange.bind(this) }
                        disabled={ this.props.disabled }
                        onBlur={ this.onBlur.bind(this) }
                        required={ this.props.required }
                    />
                    <HelpBlock>{ this.props.error }</HelpBlock>
                </Col>
            </FormGroup>
        )
    }
}

FormField.defaultProps = {
    labelSize: 2,
    inputSize: 8,
    disabled: false,
    required: false
}

export function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}
