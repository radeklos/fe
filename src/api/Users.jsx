import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";

import {fetchHandler} from "./handler.jsx";


export function PerformRegistration(actionObject) {
    fetchHandler(fetch(config.SERVER_URL + '/v1/users', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    }), actionObject);
}

export function PerformLogin(actionObject) {
    fetchHandler(fetch(config.SERVER_URL + '/v1/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: actionObject.body.login,
            password: actionObject.body.password
        })
    }), actionObject);
}

export function GetDetails(actionObject) {
    fetchHandler(fetch(config.SERVER_URL + '/v1/users/me', {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }), actionObject);
}

export function UpdateDetails(actionObject) {
    fetchHandler(fetch(config.SERVER_URL + '/v1/users/me', {
        method: 'PUT',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: actionObject.body.firstName,
            lastName: actionObject.body.lastName,
            email: actionObject.body.email
        }),
    }), actionObject);
}
