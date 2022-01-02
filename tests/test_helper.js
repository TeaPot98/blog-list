const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Blog number two',
        author: 'Henrich Buldrich',
        url: 'localhost',
        likes: 98
    },
    {
        title: 'Blog number three',
        author: 'John Doe',
        url: 'localhost',
        likes: 65
    }
]

const nonExistingId = async () => {
    const blog = newBlog({
        title: 'willremovethissoon',
        author: 'testauthor',
        url: 'localhost',
        likes: 50
    })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}