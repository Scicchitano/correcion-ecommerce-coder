const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const ticketsCollection = 'tickets'

const ticketsSchema = new mongoose.Schema({
    cart_id: {
        type: String, //mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: false
    }
}) 
ticketsSchema.plugin(mongoosePaginate)

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

module.exports = ticketsModel;