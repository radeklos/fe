import cookie from 'react-cookie';

class User {
  constructor(token) {
    this.token = token
  }
}

export default class SessionManager {

  static get() {
    if (SessionManager.exists()) {
      var cookies = cookie.load('auth')
      return new User(cookies.token)
    }
  }

  static save(token) {
    return cookie.save('auth', {
      'token': token
    })
  }

  static remove() {
    return cookie.remove('auth')
  }

  static exists() {
    return cookie.load('auth') != undefined
  }

  static isLogIn() {
    if (SessionManager.exists()) {
      console.log('session', SessionManager.get())
      return true
    }
    return false
  }

}
