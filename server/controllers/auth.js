const jwt = require('../services/jwt')
const moment = require('moment')
const User = require('../models/user')
const message = require('../utils/message')

const willExpireToken = (token) => {
    const { exp } = jwt.decodedToken(token)
    const currentDate = moment().unix()

    return currentDate > exp
}

const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        message(res, 404, 'No se recibió el refreshToken.')
        return
    }

    const ifTokenExpired = willExpireToken(refreshToken)

    if (ifTokenExpired) {
        message(res, 404, 'El refresh token ha expirado.')
        return
    }

    const { id } = jwt.decodedToken(refreshToken)

    User.findById(id, (err, userStored) => {
        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor.')
            return
        } 

        if (!userStored) {
            message(res, 404, 'No se ha podido encontrar el usuario.')
            return
        }

        message(res, 200, '', { tokens: {
            accessToken: jwt.createAccessToken(userStored),
            refreshToken: refreshToken
        }
        })
    })

}

module.exports = { refreshAccessToken }