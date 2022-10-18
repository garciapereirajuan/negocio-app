const User = require('../models/user')
const bcrypt = require('bcrypt-nodejs')
const message = require('../utils/message')
const jwt = require('../services/jwt')

const add = (req, res) => {
    const data = req.body
    
    if (!data.username || !data.email || !data.password) {
        message(res, 404, 'Nombre, apellido, email y contraseña son obligatorios.')
        return
    }

    const user = new User(data)

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err || !hash) {
            message(res, 500, 'Ocurrió un error al encriptar la contraseña.')
            return
        }
        if (hash) {
            user.password = hash
            user.active = true //cambiar
            user.email = user.email.toLowerCase()

            user.save()
            .then(user => {
                if (!user) {
                    message(res, 500, 'Ocurrió un error en el servidor.')
                    return
                }
                message(res, 200, 'Usuario creado correctamente.')
            })
            .catch(err => {
                if (err.code === 11000) {
                    const errValue = Object.keys(err.keyValue)[0] === 'username' ? 'nombre de usuario' : 'correo electrónico'
                    message(res, 404, `Ya existe un usuario con ese ${errValue}.`)
                    return
                }
                message(res, 500, 'Ocurrió un error en el servidor.',{err})
                return
            })
        }
    })
}

const login = (req, res) => {
    const data = req.body

    const email = data.email ? data.email.toLowerCase() : null
    const username = data.username ? data.username : null
    const password = data.password ? data.password : null

    if (!email && !username) {
        message(res, 404, 'Debes ingresar con tu email o nombre de usuario.')
        return
    }

    if (!password) {
        message(res, 404, 'Debes ingresar la contraseña.')
        return
    }

    const props = email ? { email } : { username }

    User.findOne(props, (err, userStored) => {
        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor.', { err })
            return
        }
        if (!userStored) {
            const type = email ? 'correo electrónico' : 'nombre de usuario'

            message(res, 404, `No hay un usuario registrado con ese ${type}.`)
            return
        }

        if (userStored) {
            bcrypt.compare(password, userStored.password, (err, check) => {
                if (err) {
                    message(res, 500, 'Ocurrió un error al comparar las contraseñas.')
                    return
                }
                if (!check) {
                    message(res, 404, 'La contraseña es incorrecta.')
                    return
                }
                if (!userStored.active) {
                    message(res, 202, 'Este usuario debe ser activarse para poder ingresar.')
                    return
                }
                if (userStored.active) {
                    const name = userStored.name ? userStored.name : userStored.username
                    res
                        .status(200)
                        .send({
                            code: 200,
                            message: `¡Hola ${name}!`,
                            accessToken: jwt.createAccessToken(userStored),
                            refreshToken: jwt.createRefreshToken(userStored) 
                        })
                }
            })
        }
    })
}

const show = (req, res) => {
    const { active } = req.query

    User.find({ active }, (err, users) => {
        const statusOfUser = active ? 'activo' : 'inactivo'
        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor.', { err })
            return
        }
        if (users.length === 0) {
            message(res, 404, `No se encontró ningún usuario ${statusOfUser}.`)
            return
        }
        
        message(res, 200, { users })
    })
}

const update = (req, res) => {
    const { id } = req.params
    const data = req.body

    if (!id) {
        message(res, 404, 'El id del usuario es requerido.')
    }

    if (!data.username || !data.email) {
        message(res, 404, 'Nombre de usuario y correo electrónico son obligatorios.')
        return
    }

    if (data.email) {
        data.email = data.email.toLowerCase()
    }

    const updateUser = () => {
        User.findByIdAndUpdate(id, data, (err, user) => {
            if (err?.path === '_id') {
                message(res, 404, 'El usuario que intentas actualizar no existe.')
                return
            }
            if (err) {
                message(res, 500, 'Ocurrió un error en el servidor.', { err })
                return
            }
            if (!user) {
                message(res, 404, 'El usuario que intentas actualizar no existe.')
                return
            }
            
            message(res, 200, 'Usuario actualizado correctamente.')
            return
        })
    }

    if (!data.password) {
        updateUser()
    }

    if (data.password) {
        bcrypt.hash(data.password, null, null, (err, hash) => {
            if (err || !hash) {
                message(res, 500, 'Ocurrió un error al encriptar la nueva contraseña.')
                return
            }
            if (hash) {
                data.password = hash
                updateUser()
            }
        })
    }
}

const remove = (req, res) => {
    const { id } = req.params

    if (!id) {
        message(res, 404, 'El id del usuario es requerido.')
        return
    }

    User.findByIdAndDelete(id, (err, user) => {
        if (err?.path === '_id') {
            message(res, 404, 'El usuario que intentas eliminar no existe.')
            return
        }

        if (err) {
            message(res, 500, 'Ocurrió un error en el servidor.', { err })
            return
        }

        if (!user) {
            message(res, 404, 'El usuario que intentas eliminar no existe.')
            return
        }

        message(res, 200, 'Usuario eliminado correctamente.')
    })
}

module.exports = {
    add, login, show, update, remove
}