const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') { 
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') { 
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') { 
        return response.status(401).json({
            error: 'token epired'
        })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {

    const authorization = request.get('authorization')
    logger.info('Authorization object from tokenExtractor middleware >>> ', authorization)
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}
    
    next()
}

const userExtractor = async (request, response, next) => {
    // let token
    // const authorization = request.get('authorization')
    // logger.info(authorization)
	// if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
	// 	token = authorization.substring(7)
	// }


    const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({
			error: 'token missing or invalid'
		})
	}

    request.user = await User.findById(decodedToken.id)
    logger.info('User object from userExtractor "request.user"', request.user)
    
    next()
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}