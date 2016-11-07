import React from 'react'
import 'whatwg-fetch';

import FormField from '../forms/FormField.jsx'
import FormButton from '../forms/FormButton.jsx'


export default React.createClass({

  getInitialState: function() {
    return {
      data: {},
      errors: {}
    };
  },

  onSubmit: function(e) {
    var that = this
    fetch('http://localhost:5000/v1/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.state.data.firstName,
        lastName: this.state.data.lastName,
        email: this.state.data.email,
        password: this.state.data.password
      })
    }).then(function(responseText) {
      // todo handle 40X and 20X
      return responseText.json()
    }).then(function(json) {
      var errors = {};
      for (var key in json.errors) {
        errors[key] = json.errors[key].defaultMessage
      }
      this.setState({
        errors: errors
      })
    }.bind(this))
    e.preventDefault();
  },

  onChange: function(e) {
    var data = this.state.data
    var errors = this.state.errors
    data[e.target.name] = e.target.value
    errors[e.target.name] = ''
    this.setState({
      data: data,
      errors: errors
    })
  },

  verifyPassword: function(e) {
    if (this.state.data.hasOwnProperty('password') && this.state.data['password'].length > 0) {
      var errors = this.state.errors
      errors['verifyPassword'] = this.state.data['password'] === e.target.value ? '' : 'not same'
      this.setState({
        errors: errors
      })
    }
  },

  render() {
    return (<div>
    <h1>Join</h1>
      <form onSubmit={this.onSubmit} className="form-horizontal" autoComplete="off">
        <FormField
          type="text"
          name="firstName"
          placeholder="First name"
          error={ this.state.errors.firstName }
          onChange={ this.onChange }>First name</FormField>
        <FormField
          type="text"
          placeholder="Last name"
          name="lastName"
          error={ this.state.errors.lastName }
          onChange={ this.onChange }>Last name</FormField>
        <FormField
          type="text"
          placeholder="Email"
          name="email"
          error="email"
          error={ this.state.errors.email }
          onChange={ this.onChange }>Email</FormField>
        <FormField
          type="password"
          placeholder=""
          name="password"
          error={ this.state.errors.password }
          onChange={ this.onChange }>Password</FormField>
        <FormField
          type="password"
          placeholder="Verify password"
          name="verifyPassword"
          error={ this.state.errors.verifyPassword } />
        <FormButton>Sign in</FormButton>
      </form>
    </div>)
  }
})
