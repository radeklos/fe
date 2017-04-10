import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";


export function CreateCompany(actionObject) {
    fetch('http://localhost:5000/v1/companies', {
        method: 'POST',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    })
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            if (actionObject.hasOwnProperty('onSuccess')) {
                actionObject.onSuccess(json)
            }
        })
        .catch(function (error) {
            const handleError = function (json) {
                if (actionObject.hasOwnProperty('onError')) {
                    actionObject.onError(json)
                }
            };
            if (error.response === undefined) {
                handleError()
            } else {
                error.response.json().then(handleError)
            }
        })
}
