const express = require('express')
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

// const mongoUrl = 'mongodb+srv://fullstack:test123@cluster0.mdhmr.mongodb.net/blog-list-app?retryWrites=true&w=majority'
// mongoose.connect(config.MONGODB_URI)
// 	.then(result => {
// 		logger.info('Connected to MongoDB')
// 	})
// 	.catch(error => {
// 		logger.error('Failed to connect to MongoDB:  ', error)
// 	})

// app.use(cors())
// app.use(express.json())

// app.use('/api/blogs', blogsRouter)

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})