const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BonusProductSchema = Schema({
    title: String,
    description: String,
    option: String,
    checked: Boolean,
    visible: Boolean,
    stock: Boolean,
    order: Number
})

module.exports = mongoose.model('BonusProduct', BonusProductSchema)