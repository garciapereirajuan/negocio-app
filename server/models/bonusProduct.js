const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BonusProductSchema = Schema({
    title: String,
    price: String,
    option: String,
    checked: Boolean,
    visible: Boolean,
    stock: Boolean,
    order: Number
})

module.exports = mongoose.model('BonusProduct', BonusProductSchema)