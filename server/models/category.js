const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    order: Number,
    mainProducts: [{ type: Schema.Types.ObjectId, ref: 'MainProduct' }]
})

module.exports = mongoose.model('Category', CategorySchema)