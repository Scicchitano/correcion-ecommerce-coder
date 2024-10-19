const { Router } = require('express')
const {userModel} = require('../dao/models/users.model.js')
const { createHash, isValidPassword } = require('../utils/hashBcrypt')
const passport = require('passport')
const isAdmin = require('../middleware/isAdmin.js')
const SessionController = require('../controllers/sessions.controller')

const router = Router()



const {
    register,
    login,
    current,
    logout,
    failregister,
    deleteUsers
} = new SessionController()


router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}) , login)

router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failregister'}) , register)

router.get('/current', isAdmin, current);

router.get('/logout', logout)

router.get('/failregister', failregister)

router.delete('/', deleteUsers)



router.get('/github', passport.authenticate('github', {scope:['user:email']}),async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/session/login'} ),async (req, res) => {
    req.session.user = req.user
    res.redirect('/realtimeproducts')
})


module.exports = router