import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";

import {fetchHandler} from "./handler.jsx";


export function CreateCompany(actionObject) {
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies', {
        method: 'POST',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    }), actionObject);
}

export function GetCompany(actionObject) {
    let user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + user.getCompanyId(), {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }), actionObject);
}

export function GetDepartment(actionObject) {
    let user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + user.getCompanyId() + '/departments', {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    }), actionObject);
}


export function GetCompanyEmployees(actionObject) {
    let user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + user.getCompanyId() + '/employees', {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    }), actionObject);
}


export function CreateDepartment(actionObject) {
    console.log(JSON.stringify(actionObject.body));

    let user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + user.getCompanyId() + '/departments', {
        method: 'POST',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionObject.body)
    }), actionObject);
}
