import React from 'react'
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';


export default class FormField extends React.Component {

  onChange(e) {
    this.props.onChange(e)
  }

  render() {
    return (
      <FormGroup validationState={ this.props.error ? "error" : "" }>
        <Col componentClass={ControlLabel} sm={2}>{ this.props.children }</Col>
        <Col sm={8}>
          <FormControl
            type={ this.props.type }
            id={ this.props.name }
            name={ this.props.name }
            rel={ this.props.name }
            placeholder={ this.props.placeholder }
            onChange={ this.onChange.bind(this) }
          />
          <HelpBlock>{ this.props.error }</HelpBlock>
        </Col>
      </FormGroup>
    )
  }
}
