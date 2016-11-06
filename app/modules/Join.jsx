import React from 'react'
import 'whatwg-fetch';

import SingUpForm from '../forms/SignUp.jsx'

function formFieldFactory() {
  return {
    value: '',
    error: ''
  }
}

export default React.createClass({

  getInitialState: function() {
    return {
      formData: {
        firstName: formFieldFactory(),
        lastName: formFieldFactory(),
        email: formFieldFactory(),
        password: formFieldFactory(),
        verifyPassword: formFieldFactory(),
      }
    };
  },

  setFormData: function(formData) {
    this.setState({
      formData: formData
    });
  },

  handleSubmit: function(e) {
    var that = this
    fetch('http://localhost:5000/v1/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.state.formData.firstName.value,
        lastName: this.state.formData.lastName.value,
        email: this.state.formData.email.value,
        password: this.state.formData.password.value
      })
    }).then(function(responseText) {
      // todo handle 40X and 20X
      return responseText.json()
    }).then(function(json) {
      var data = this.state.formData;
      for (var key in data) {
        data[key]['error'] = json.errors.hasOwnProperty(key) ? json.errors[key].defaultMessage : ""
      }
      this.setState({
        formData: data
      })
    }.bind(this))
    e.preventDefault();
  },

  render() {
    return (<div>
    <h1>Join</h1>
      <form onSubmit={this.handleSubmit} className="form-horizontal">
        <SingUpForm
          data={this.state.formData}
          setFormData={this.setFormData} />
      </form>
    </div>)
  }
})
