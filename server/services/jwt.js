const jwt = require('jwt-simple')
const moment = require('moment')

const SECRET_KEY = 'jV854bd9TQmb61906kJd823Bv897g34nd834H'

exports.createAccessToken = user => {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        type: user.type,
        createAccessToken: moment().unix(),
        exp: moment().add(3, 'hours').unix()
    }

    return jwt.encode(payload, SECRET_KEY)
}

exports.createRefreshToken = user => {
    const payload = {
        id: user._id,
        exp: moment().add(30, 'days').unix(),
    }

    return jwt.encode(payload, SECRET_KEY)
}

exports.decodedToken = token => {
    return jwt.decode(token, SECRET_KEY, true)
}

