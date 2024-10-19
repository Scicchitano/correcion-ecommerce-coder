const { Router } = require('express')
const { loggerWrite } = require('../logger/logger')


const router = Router()



function testLogger() {
    loggerWrite.fatal('FATAL TEST');
    loggerWrite.error('ERROR TEST');
    loggerWrite.warning('WARNING TEST');
    loggerWrite.debug('DEBUG TEST');
    loggerWrite.info('INFO TEST');
    loggerWrite.http('HTTP TEST');
}

router.get('',        testLogger )

module.exports = router
