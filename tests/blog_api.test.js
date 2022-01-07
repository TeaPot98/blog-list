const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const middleware = require('../utils/middleware')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('returned expected number of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('successfully created new blog', async () => {
    const newBlog = {
        title: 'simple blog',
        author: 'John Doe',
        url: 'url',
        likes: 15
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3Q1IiwiaWQiOiI2MWQ3ZjVhN2I2N2Y1N2UyMzZkYTE1MDkiLCJpYXQiOjE2NDE1NTc2NTl9.0zBQkx4OvcMor0xyfgy_AZT4umchs1W9vcfPinzCizc`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
        'simple blog'
    )
}, 10000)

afterAll(() => {
    mongoose.connection.close()
})