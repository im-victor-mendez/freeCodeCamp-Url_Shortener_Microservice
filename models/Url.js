const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const UrlSchema = new Schema({
    original_url: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('Url', UrlSchema)