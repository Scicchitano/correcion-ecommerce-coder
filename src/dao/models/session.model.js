const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const loginsCollection = 'logins'

const loginsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    last_connection: {
        type: String,
        required: true
    },
    role: {
        type: String
    }
}) 
loginsSchema.plugin(mongoosePaginate)

const loginModel = mongoose.model(loginsCollection, loginsSchema)

module.exports = {
    loginModel
}