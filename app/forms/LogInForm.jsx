import React from 'react';

import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  HelpBlock,
  FieldGroup,
  Checkbox,
  Button,
  Alert
} from 'react-bootstrap';
import SessionManager from '../services/Session.jsx'
import {
  PerformLogin
} from '../api/Users.jsx'


export default React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      data: {},
      error: '',
    }
  },

  onSubmit: function(e) {
    PerformLogin({
      body: {
        login: this.state.data.login,
        password: this.state.data.password,
      },
      onSuccess: function(json) {
        this.setState({
          error: undefined
        })
        SessionManager.save(json.token)
        this.props.onSuccessLogin()
      }.bind(this),
      onError: function(json) {
        this.setState({
          error: 'Your login or password is invalid. Please try it again.'
        })
      }.bind(this)
    })
    e.preventDefault();
  },

  onChange: function(e) {
    var data = this.state.data
    data[e.target.name] = e.target.value
    this.setState({
      data: data,
    })
  },

  alert: function(error) {
    if (error) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
          <h4>Sorry I can't let you in</h4>
          <p>{error}</p>
        </Alert>
      )
    }
  },

  render() {

    return (
      <Form horizontal onSubmit={this.onSubmit} method="post" autoComplete="off">
        {this.alert(this.state.error)}

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl type="email" name="login" placeholder="Email" onChange={ this.onChange } />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl type="password" name="password" placeholder="Password" onChange={ this.onChange } />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Checkbox>Remember me</Checkbox>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit">
              Sign in
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
})
