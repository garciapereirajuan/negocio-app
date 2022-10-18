const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = Schema({
    title: String,
    description: String,
    image: String,
    visible: Boolean,
    order: Number,
    mainProducts: [{ type: Schema.Types.ObjectId, ref: 'MainProduct' }]
})

module.exports = mongoose.model('Category', CategorySchema)