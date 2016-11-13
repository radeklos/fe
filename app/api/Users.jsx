import 'whatwg-fetch';


export default function PerformRegistration(actionObject) {
  fetch('http://localhost:5000/v1/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(actionObject.body)
    })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if (actionObject.hasOwnProperty('onSuccess')) {
        actionObject.onSuccess(json)
      }
    }.bind(this))
    .catch(function(error) {
      return error.response.json().then(function(json) {
        if (actionObject.hasOwnProperty('onError')) {
          actionObject.onError(json)
        }
      })
    })
}
