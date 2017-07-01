
class User {

    constructor(user) {
        this.user = user
    }

    isInCompany() {
        return !!('company' in this.getDetails() && this.getDetails().company);
    }

    getDetails() {
        return this.user;
    }

    getCompanyId() {
        if (!this.getDetails().company) {
            return null;
        }
        return this.getDetails().company.uid;
    }

    static getTokenData() {
        return atob(this.token.split('.')[1])
    }

}


const tokenNs = 'token'
const userNs = 'user'

export default class SessionManager {

    static get() {
        let login = localStorage.getItem(tokenNs);
        return login != null ? JSON.parse(login) : null;
    }

    static getToken() {
        return this.get() ? this.get().token : null
    }

    static save(data) {
        localStorage.setItem(tokenNs, JSON.stringify(data))
    }

    static saveUserDetails(data) {
        localStorage.setItem(userNs, JSON.stringify(data))
    }

    static getUserDetails() {
        let user = localStorage.getItem(userNs);
        return user != null ? new User(JSON.parse(user)) : null;
    }

    static remove() {
        localStorage.removeItem(tokenNs);
    }

    static exists() {
        return this.get() != null;
    }

    static isLogIn() {
        return this.exists();
    }

}
