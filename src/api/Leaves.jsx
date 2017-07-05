import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";

import {fetchHandler} from "./handler.jsx";


export function GetLeaves(actionObject, from, to) {
    const user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/company/' + user.getCompanyId() + '/leaves?from=' + from + '&to=' + to, {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }), actionObject);
}


export function CreateLeave(actionObject, data) {
    const user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/users/' + user.getId() + '/leaves', {
        method: 'POST',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            leaveType: data.leaveType,
            startingAt: data.startingAt.toUpperCase(),
            starting: data.starting,
            endingAt: data.endingAt.toUpperCase(),
            ending: data.ending,
            reason: data.reason,
        })
    }), actionObject);
}
