import React from 'react'
import 'whatwg-fetch';

import SingUpForm from '../forms/SignUp.jsx'

export default React.createClass({
  getInitialState: function() {
    return {
      f: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        verifyPassword: '',
      }
    };
  },

  setFormData: function(formDate) {
    this.setState({
      f: formDate
    });
  },


  handleSubmit: function(e) {
    console.log("state", this.state.f)
    fetch('http://localhost:5000/v1/users', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.state.f.firstName,
        lastName: this.state.f.lastName,
        email: this.state.f.email,
        password: this.state.f.password
      })
    }).then(function(response) {
      // return response.text()
    }).then(function(body) {
      // document.body.innerHTML = body
    })
    e.preventDefault();
  },

  render() {
    return (<div>
    <h1>Join</h1>
      <form onSubmit={this.handleSubmit} className="form-horizontal">
        <SingUpForm
          { ...this.state } setFormData={this.setFormData} />
      </form>
    </div>)
  }
})
