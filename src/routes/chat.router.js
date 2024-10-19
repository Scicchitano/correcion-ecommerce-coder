const express = require('express')
const connectDB = require('../configDB/connectDB')

const router = Router()

const chatRouter = (io) => {
	connectDB(io)
	
	router.get('/', (req, res) => {
		try {
			res.render('chat/chat')
		} catch (error) {
			res.render({error})
		}
	})
	
	return router
}

export default chatRouter