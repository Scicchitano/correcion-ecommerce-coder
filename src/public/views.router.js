const {Router} = require('express')
const { userModel } = require('../dao/models/users.model')

const router_view = Router()


console.log('router_view')

router_view.get('/', (req, res) => {
    res.render('index')
})
router_view.get('/users', async (req, res) => {
    const {limit = 10, pageQuery = 1} = req.query
    const {
        docs,
        hasPrevPage, 
        hasNextPage,
        prevPage, 
        nextPage,
        page 
    } = await userModel.paginate({}, {limit, page: pageQuery, sort: {first_name: -1}, lean: true})
    // console.log(docs,
    //     hasPrevPage, 
    //     hasNextPage,
    //     prevPage, 
    //     nextPage,
    //     page)
    res.render('users', {
        limit: limit,
        users: docs,
        hasPrevPage, 
        hasNextPage,
        prevPage, 
        nextPage,
        page 
    })
})

module.exports = router_view