import React from 'react'
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Checkbox,
  Button,
  HelpBlock
} from 'react-bootstrap';


export default class SingUpForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
  }

  onChange(e) {
    this.state['data'][e.target.name]['value'] = e.target.value
    this.setState(this.state)
    this.props.setFormData(this.state['data'])
  }

  render() {
    return (
      <div>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>First name</Col>
            <Col sm={8}>
              <FormControl
                type="text"
                id="first"
                value={ this.state.data.firstName.value }
                name="firstName"
                placeholder="First name"
                onChange={ this.onChange.bind(this) } />
              <HelpBlock>{ this.state.data.firstName.error }</HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup controlId="formValidationWarning1">
            <Col componentClass={ControlLabel} sm={2}>Last name</Col>
              <Col sm={8}>
              <FormControl
                type="text"
                placeholder="Last name"
                name="lastName"
                value={ this.state.data.lastName.value }
                onChange={ this.onChange.bind(this) } />
              <HelpBlock>{ this.state.data.lastName.error }</HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Email</Col>
            <Col sm={8}>
              <FormControl
                type="text"
                placeholder="Email"
                name="email"
                value={ this.state.data.email.value }
                onChange={ this.onChange.bind(this) } />
              <HelpBlock>{ this.state.data.email.error }</HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Password</Col>
            <Col sm={8}>
              <FormControl
                type="password"
                placeholder=""
                name="password"
                value={ this.props.data.password.value }
                onChange={ this.onChange.bind(this) } />
              <HelpBlock>{ this.props.data.password.error }</HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={8}><FormControl
              type="password"
              placeholder="Verify password"
              name="verifyPassword"
              value={ this.props.data.verifyPassword.value }
              onChange={ this.onChange.bind(this) } /></Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={8}>
              <Button type="submit">Sign in</Button>
            </Col>
          </FormGroup>
        </div>
    )
  }
}
