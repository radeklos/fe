import React from 'react'
import 'whatwg-fetch';

import FormField from '../forms/FormField.jsx'
import FormButton from '../forms/FormButton.jsx'


export default React.createClass({

  getInitialState: function() {
    return {
      data: {},
      errors: {},
      isLoading: false
    };
  },

  onSubmit: function(e) {
    this.verifyPassword()
    console.log(this.state.errors)
    if (Object.keys(this.state.errors).length == 0) {
      this.setState({
        isLoading: true
      })
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
          errors: errors,
          isLoading: false
        })
      }.bind(this))
    }
    e.preventDefault();
  },

  onChange: function(e) {
    var data = this.state.data
    var errors = this.state.errors
    data[e.target.name] = e.target.value
    delete errors[e.target.name]
    this.setState({
      data: data,
      errors: errors
    })
  },

  verifyPassword: function() {
    var passwordVerified = this.state.data.hasOwnProperty('verifyPassword') ? this.state.data.verifyPassword : ""
    var errors = this.state.errors
    delete errors["verifyPassword"]
    if (this.state.data.hasOwnProperty('password') && this.state.data['password'].length > 0) {
      if (this.state.data['password'] !== passwordVerified) {
        errors['verifyPassword'] = 'not same'
      }
    }
    this.setState({
      errors: errors
    })
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
          onChange={ this.onChange } >Password</FormField>
        <FormField
          type="password"
          placeholder="Verify password"
          name="verifyPassword"
          error={ this.state.errors.verifyPassword }
          onChange={ this.onChange }
          onBlur={ this.verifyPassword } />
        <FormButton isLoading={ this.state.isLoading }>Sign in</FormButton>
      </form>
    </div>)
  }
})
