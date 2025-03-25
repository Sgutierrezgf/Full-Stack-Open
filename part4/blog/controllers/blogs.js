const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const { title, url, author, likes } = request.body


    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    if (!title || !url) {
        return response.status(400).json({ error: 'Title and URL are required' })
    }

    let user
    if (request.body.userId) {
        user = await User.findById(request.body.userId)
    } else {
        user = await User.findOne()
    }

    const blog = new Blog({
        title,
        url,
        author,
        likes: likes || 0,
        user: user ? user.id : null,
    })

    const result = await blog.save()

    if (user) {
        user.blogs = user.blogs.concat(result._id)
        await user.save()
    }

    response.status(201).json(result)
})
blogsRouter.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ error: 'Invalid ID format' })
        }

        const deletedBlog = await Blog.findByIdAndDelete(id)

        if (!deletedBlog) {
            return response.status(404).json({ error: 'Blog not found' })
        }

        if (deletedBlog.user) {
            const user = await User.findById(deletedBlog.user)
            user.blogs = user.blogs.filter(blog => blog.toString() !== deletedBlog._id.toString())
            await user.save()
        }

        response.status(204).end()
    } catch (error) {
        console.error(`Error deleting blog: ${error.message}`)
        response.status(400).json({ error: 'Invalid ID format' })
    }
})
blogsRouter.put('/:id', async (request, response) => {
    const { id } = request.params
    const { likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { likes },
        { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedBlog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(updatedBlog)
})
module.exports = blogsRouter
