const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BonusProductSchema = Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    image: String,
    price: Number,
    order: Number,
    visible: Boolean,
    stock: Boolean,
})

module.exports = mongoose.model('BonusProduct', BonusProductSchema)