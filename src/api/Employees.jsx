import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";

import {fetchHandler} from "./handler.jsx";


export function ImportEmployees(companyId, file, actionObject) {
    var data = new FormData()
    data.append('file', file)

    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + companyId + '/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-Authorization': "Bearer " + SessionManager.get().token,
        },
        body: data
    }), actionObject);
}

export function GetDepartmentEmployees(companyId, departmentId, actionObject) {
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + companyId + '/departments/' + departmentId + '/employees', {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }), actionObject);
}

export function CreateNewEmployee(departmentId, actionObject, data) {
    const user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/companies/' + user.getCompanyId() + '/departments/' + departmentId + '/employees', {
        method: 'POST',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }), actionObject);
}
