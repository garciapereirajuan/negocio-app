const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    name: String,
    lastname: String,
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    active: Boolean
})

module.exports = mongoose.model('User', UserSchema)