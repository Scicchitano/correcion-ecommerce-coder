const { Router } = require('express')
const MockController = require('../controllers/mock.controller')

const router = Router()

const {
    generateUsers,
    generateProducts
} = new MockController()

router.get('/generateUsers',        generateUsers )
router.get('/mockingProducts',        generateProducts )

module.exports = router
