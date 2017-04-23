import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";


export function PerformRegistration(actionObject) {
    fetch(config.SERVER_URL + '/v1/users', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    })
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                const error = new Error(response.statusText);
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
            return error.response.json().then(function (json) {
                if (actionObject.hasOwnProperty('onError')) {
                    actionObject.onError(json)
                }
            })
        })
}

export function PerformLogin(actionObject) {
    fetch(config.SERVER_URL + '/v1/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: actionObject.body.login,
            password: actionObject.body.password
        })
    })
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                const error = new Error(response.statusText);
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
            handleError()
        })
}

export function GetDetails(actionObject) {
    fetch(config.SERVER_URL + '/v1/users/me', {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(function (response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    }).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (actionObject.hasOwnProperty('onSuccess')) {
            actionObject.onSuccess(json)
        }
    }).catch(function (error) {
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
