const _ = require('lodash')

const dummy = blogs => {
	return 1
}

const totalLikes = blogs => {
	let sum = 0

	blogs.map(blog => sum += blog.likes)

	return sum
}

const favoriteBlog = blogs => {

	if (blogs.length > 1) {
		const favBlog = blogs.reduce((a, b) => a.likes > b.likes ? a : b)

		return {
			title: favBlog.title,
			author: favBlog.author,
			likes: favBlog.likes
		}
	}

	return blogs.length === 0 ? 
		{
			error: 'no blogs provided'
		} : 
		{
			title: blogs[0].title,
			author: blogs[0].author,
			likes: blogs[0].likes
		} 
}

const mostBlogs = blogs => {

	if (blogs.length > 1) {
		const groupedBlogs = _.groupBy(blogs, 'author')
		const mostArticlesAuthor = Object.keys(groupedBlogs).reduce((a, b) => {
			return groupedBlogs[a].length > groupedBlogs[b].length ? a : b
		})
		return {
			author: mostArticlesAuthor,
			blogs: groupedBlogs[mostArticlesAuthor].length
		}
	}

	return blogs.length === 0 ? 
		{
			error: 'no blogs provided'
		} : 
		{
			author: blogs[0].author,
			blogs: 1
		} 
}

const mostLikes = blogs => {
	if (blogs.length > 1) {
		const groupedBlogs = _.groupBy(blogs, 'author')
		const authorsAndLikes = Object.keys(groupedBlogs).map(key => {
			let likes = 0
			if (groupedBlogs[key].length > 1) {
				likes = groupedBlogs[key].reduce((a, b) => {
					return a + b.likes
				}, 0)
			} else {
				likes = groupedBlogs[key][0].likes
			}

			return {
				author: key,
				likes: likes
			}
		})

		const mostLikedAuthor = authorsAndLikes.reduce((a, b) => {
			return a.likes > b.likes ? a : b
		})

		return mostLikedAuthor
	}

	return blogs.length === 0 ? 
		{
			error: 'no blogs provided'
		} : 
		{
			author: blogs[0].author,
			likes: blogs[0].likes
		} 
}

module.exports = {
	totalLikes,
	dummy,
	favoriteBlog,
	mostBlogs,
	mostLikes
}
