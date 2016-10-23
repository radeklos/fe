import React from 'react'
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Checkbox,
  Button
} from 'react-bootstrap';


export default class SingUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.f
  }

  onChange(e) {
    this.state[e.target.name] = e.target.value
    this.setState(this.state)
    this.props.setFormData(this.state)
  }

  render() {
    return (
      <div>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>First name</Col>
              <Col sm={8}><FormControl
                      type="text"
                      id="first"
                      value={ this.state.firstName }
                      name="firstName"
                      placeholder="First name"
                      onChange={ this.onChange.bind(this) } /></Col>
          </FormGroup>

          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Last name</Col>
              <Col sm={8}><FormControl
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  value={ this.props.lastName }
                  onChange={ this.onChange.bind(this) } /></Col>
          </FormGroup>

          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Email</Col>
              <Col sm={8}><FormControl
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={ this.props.email }
                  onChange={ this.onChange.bind(this) } /></Col>
          </FormGroup>

          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Password</Col>
              <Col sm={8}><FormControl
                  type="password"
                  placeholder=""
                  name="password"
                  value={ this.props.password }
                  onChange={ this.onChange.bind(this) } /></Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={8}><FormControl
              type="password"
              placeholder="Verify password"
              name="verifyPassword"
              value={ this.props.verifyPassword }
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
