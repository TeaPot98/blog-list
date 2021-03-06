const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const middlewareWrapper = require('cors')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({})
		.populate('user', {
			username: 1,
			name: 1
		})
	response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
	const body = request.body
	
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({
			error: 'token missing or invalid'
		})
	}
	
	const user = request.user
	logger.info('User >>>', user)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id
	})

	let savedBlog = await blog.save()
	savedBlog = savedBlog.toJSON()
	
	user.blogs = user.blogs.concat(savedBlog.id)
	await user.save()

	savedBlog = {
		...savedBlog,
		user: {
			'username': user.username,
			'name': user.name,
			'id': user._id.toString()
		}
	}

	logger.info('The savedBlog sent to the frontend >>> ', savedBlog)

	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id',middleware.userExtractor , async (request, response) => {
	const user = request.user
	logger.info('User: ', user)
	logger.info('Entering the remove handler')
	const blog = await Blog.findById(request.params.id)
	logger.info(blog)
	logger.info('Id of blog', request.params.id)
	if (blog.user.toString() === user._id.toString()) {
		await blog.remove()
		logger.info('Successfull removed blog', blog)
	}

	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body
// 
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
	response.json(updatedBlog)
})

module.exports = blogsRouter