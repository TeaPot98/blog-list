const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')


describe('testing user creation', () => {

    test('invalid users are not created and a suitable status code and error are returned', async () => {
        
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'John Doe',
            password: 'test123'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('`username` to be unique')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('too short password returns suitable status code and error message', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'uniqueUsername',
            name: 'Joana Doe',
            password: '12'
        }

        const result = await api 
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('the password must be at least 3 characters long')
    })
})
