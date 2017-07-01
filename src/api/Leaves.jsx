import "whatwg-fetch";
import SessionManager from "../services/Session.jsx";
import {config} from "../config";

import {fetchHandler} from "./handler.jsx";


export function GetLeaves(actionObject, from, to) {
    let user = SessionManager.getUserDetails();
    fetchHandler(fetch(config.SERVER_URL + '/v1/company/' + user.getCompanyId() + '/leaves?from=2017-01-01&to=2017-01-31', {
        method: 'GET',
        headers: {
            'X-Authorization': "Bearer " + SessionManager.getToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }), actionObject);
}
