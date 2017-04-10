import cookie from "react-cookie";

class User {

    constructor(token) {
        this.token = token
    }

    setDetails(details) {
        this.details = details
    }

    isInCompany() {
        return '_links' in this.details && this.details._links
    }

    getDetails() {
        return this.details
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

}
