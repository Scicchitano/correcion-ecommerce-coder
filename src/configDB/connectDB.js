const mongoose = require("mongoose")
const dotenv = require('dotenv')
const { program } = require("../enviroment/commander")

const { mode } = program.opts()
console.log(mode)
dotenv.config({
    path: mode === 'development' ? 'src/enviroment/.env.development' : 'src/enviroment/.env.production'
})

exports.configObject = {
    port: process.env.PORT || 8080,
    mongo_url: process.env.MONGO_URL,
    jwt_secret_Key: process.env.JWT_SECRET_KEY,
    persistence:    process.env.PERSISTENCE,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS
}

console.log("process.env.MONGO_URL" + process.env.MONGO_URL)

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        // await mongoose.connect('mongodb://127.0.0.1:27017/c50010')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}