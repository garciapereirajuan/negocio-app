const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BonusProductSchema = Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    order: Number,
    visible: Boolean,
    stock: Boolean,
})

module.exports = mongoose.model('BonusProduct', BonusProductSchema)