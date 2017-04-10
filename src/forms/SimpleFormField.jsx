import React from "react";
import {ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";


export default class SimpleFormField extends React.Component {

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
                <ControlLabel>{ this.props.children }</ControlLabel>
                <FormControl
                    type={ this.props.type }
                    id={ this.props.name }
                    name={ this.props.name }
                    rel={ this.props.name }
                    min={ this.props.min }
                    placeholder={ this.props.placeholder }
                    onChange={ this.onChange.bind(this) }
                    onBlur={ this.onBlur.bind(this) }
                />
                <HelpBlock>{ this.props.error }</HelpBlock>
            </FormGroup>
        )
    }
}
