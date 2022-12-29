const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MainProductSchema = Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    image: String,
    price: Number,
    order: {
        type: Number,
        default: -1,
    },
    visible: Boolean,
    stock: Boolean,
    dozen: Boolean,
    allowHalf: Boolean, 
    bonusProducts: [{ type: Schema.Types.ObjectId, ref: 'BonusProduct' }]
})

module.exports = mongoose.model('MainProduct', MainProductSchema)