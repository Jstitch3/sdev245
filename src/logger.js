import winston from 'winston'

/**
 * @type {winston.Logger}
 */
let logger

function init(verbose){
    const level = verbose ? 'debug' : 'info'

    logger = winston.createLogger({
        format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({level, message, timestamp}) => `${timestamp} ${level}: ${message}`)),
        level,
        transports: [new winston.transports.Console(), new winston.transports.File({filename: 'secret-scan.log'})]
    })
}

function debug(msg){if(logger) logger.debug(msg)}
function error(msg){if(logger) logger.error(msg)}
function info(msg){if(logger) logger.info(msg)}

export default { debug, error, info, init }