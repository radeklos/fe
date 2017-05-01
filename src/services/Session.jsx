import cookie from "react-cookie";

import {GetDetails} from "./../api/Users.jsx";

class User {

    constructor(token) {
        this.token = token
    }

    setDetails(details) {
        cookie.save('user', {details: details});
    }

    isInCompany() {
        return !!('company' in this.getDetails() && this.getDetails().company);
    }

    getDetails() {
        return cookie.load('user').details;
    }

    static getTokenData() {
        return atob(self.token.split('.')[1])
    }

}

export default class SessionManager {

    static get() {
        if (SessionManager.exists()) {
            let cookies = cookie.load('auth');
            return new User(cookies.token)
        }
    }

    static save(response) {
        return cookie.save('auth', {
            'token': response.token,
            'refreshToken': response.refreshToken
        })
    }

    static remove() {
        return cookie.remove('auth')
    }

    static exists() {
        return cookie.load('auth') !== undefined
    }

    static isLogIn() {
        return SessionManager.exists()
    }

    static refreshUserDetails() {
        GetDetails({
            onSuccess: function (json) {
                console.log('refresh', json);
                let user = SessionManager.get();
                user.setDetails(json);
            },
            onError: function (json) {
                // this.logout()
            }
        })
    }

}
