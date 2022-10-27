const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BonusProductSchema = Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    checked: Boolean,
    visible: Boolean,
    disponibility: Boolean,
    order: Number
})

module.exports = mongoose.model('BonusProduct', BonusProductSchema)