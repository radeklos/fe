import React from 'react'
import 'whatwg-fetch';

import FormField from '../forms/FormField.jsx'
import FormButton from '../forms/FormButton.jsx'
import PerformRegistration from '../api/Users.jsx'

import {browserHistory} from 'react-router'

export const Join = React.createClass({

  getInitialState: function() {
    return {
      data: {},
      errors: {},
      isLoading: false
    };
  },

  onSubmit: function(e) {
    this.verifyPassword()
    if (Object.keys(this.state.errors).length == 0) {
      this.setState({
        isLoading: true
      })

      PerformRegistration({
        body: {
          firstName: this.state.data.firstName,
          lastName: this.state.data.lastName,
          email: this.state.data.email,
          password: this.state.data.password
        },
        onSuccess: function() {
          browserHistory.push('/join/finished')
        },
        onError: function(json) {
          var errors = {};
          for (var key in json.errors) {
            errors[key] = json.errors[key].defaultMessage
          }
          this.setState({
            errors: errors,
            isLoading: false
          })
        }.bind(this)
      })
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
        errors['verifyPassword'] = 'Passwords are not same'
      }
    }
    this.setState({
      errors: errors
    })
  },

  render() {
    return (<div>
    <h1>Join</h1>
      <form onSubmit={this.onSubmit} className="form-horizontal" method='post' autoComplete="off">
        <FormField
          type="text"
          name="firstName"
          placeholder="First name"
          required={true}
          error={ this.state.errors.firstName }
          onChange={ this.onChange }>First name</FormField>
        <FormField
          type="text"
          placeholder="Last name"
          name="lastName"
          required={true}
          error={ this.state.errors.lastName }
          onChange={ this.onChange }>Last name</FormField>
        <FormField
          type="email"
          placeholder="Email"
          name="email"
          required={true}
          error={ this.state.errors.email }
          onChange={ this.onChange }>Email</FormField>
        <FormField
          type="password"
          placeholder=""
          name="password"
          required={true}
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

export const Finished = React.createClass({

  getInitialState: function() {
    return {};
  },

  render() {
    return (<div>
    <h1>Check your email</h1>
    <p>We've send a message to your email. Open it up and click Active Account. We'll take if from there</p>
    </div>)
  }
})
