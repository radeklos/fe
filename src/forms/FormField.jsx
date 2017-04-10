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
                <Col componentClass={ControlLabel} sm={2}>{ this.props.children }</Col>
                <Col sm={8}>
                    <FormControl
                        type={ this.props.type }
                        id={ this.props.name }
                        name={ this.props.name }
                        rel={ this.props.name }
                        placeholder={ this.props.placeholder }
                        onChange={ this.onChange.bind(this) }
                        onBlur={ this.onBlur.bind(this) }
                    />
                    <HelpBlock>{ this.props.error }</HelpBlock>
                </Col>
            </FormGroup>
        )
    }
}
