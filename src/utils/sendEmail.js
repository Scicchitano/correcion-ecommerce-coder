const nodemailer = require('nodemailer')
const { configObject } = require('../configDB/connectDB')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    }
})



exports.sendMail = async (to, subject, html) => await transport.sendMail({
    from: 'Coder test <arianaortigoza4@gmail.com>',
    to,
    subject ,
    html
})