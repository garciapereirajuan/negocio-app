const jwt = require('../services/jwt')
const moment = require('moment')
const message = require('../utils/message')

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        message(res, 403, 'La petición no tiene cabecera de autenticación.')
        return 
    }

    const token = req.headers.authorization.replace(/["']+/g, '')

    try {
        var payload = jwt.decodedToken(token)

        if (payload.type !== "admin") {
            message(res, 404, "Debes ser Administrador para hacer cambios en este sitio.");
            return;
        }

        if (payload.exp <= moment().unix()) {
            message(res, 404, 'El token ha expirado.')
            return
        }
    } catch (ex) {
        message(res, 500, 'Lo siento, antes de continuar debes recargar la página. Esto sucede como método de seguridad. Si aún así seguís viendo esta alerta, avisame por favor.')
        return
    }

    req.user = payload
    next()
}
