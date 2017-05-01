import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";


export function ImportEmployees(actionObject) {
    var data = new FormData()
    data.append('file', actionObject.file)
    data.append('user', 'hubot')

    fetch(config.SERVER_URL + '/v1/companies/%s/employees', {
        method: 'POST',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.get().token,
        },
        body: JSON.stringify(actionObject.body)
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
