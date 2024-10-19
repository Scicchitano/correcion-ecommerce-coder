const winston = require('winston')
const dotenv = require('dotenv')
const { program } = require("../enviroment/commander")


const { mode } = program.opts()
dotenv.config({
    path: mode === 'development' ? 'src/enviroment/.env.development' : 'src/enviroment/.env.production'
})

exports.configObject = {
    level_console_log: process.env.LEVEL_CONSOLE_LOG || 'info'
}

console.log("level_console_log: " + process.env.LEVEL_CONSOLE_LOG)

const levelOptions = {
    levels: {
        fatal: 0,
        error:1,
        warning: 2,
        info: 3,
        debug: 4,
        http: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'blue'
    }
}
const loggerWrite = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log', 
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

// middleware
const addLogger = (req, res, next) => {
    req.logger = loggerWrite
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
} 

module.exports = {
    addLogger,
    loggerWrite
}