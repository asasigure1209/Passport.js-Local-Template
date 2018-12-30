const fs = require('fs')

class User {
    constructor(username, id, password) {
        this._name = username
        this._id = id
        this._password = password
    }

    static findOne(userInfo, callback) { //本来はDBとかから探す
        let userList = JSON.parse(fs.readFileSync('./user.json', 'utf8'))
        let user = userList.filter((item, index) => {
            if (item.username === userInfo.username) return true
        })
        
        if (!user.length) return callback(null, null)

        return callback(null, new User(user[0].username, user[0].id, user[0].password))
    }

    static findById(id, callback) { //本来はDBとかから探す
        let userList = JSON.parse(fs.readFileSync('./user.json', 'utf8'))
        let user = userList.filter((item, index) => {
            if (item.id === id) return true
        })

        if (!user.length) return callback(new Error('user is not define'))
        return callback(null, new User(user[0].username, user[0].id, user[0].password))
    }

    validPassword(password) {
        if (password === this.password) return true
        return false
    }

    get name() {
        return this._name
    }

    get id() {
        return this._id
    }

    get password() {
        return this._password
    }
}

module.exports = User