const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const usersCollection = 'users'

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    cart: {
        type: String,
        required: false
    },
    role: {
        type: String
    },
}) 
usersSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(usersCollection, usersSchema)

module.exports = {
    userModel
}