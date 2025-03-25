const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('assert')
const api = supertest(app)

const initialBlogs = [
    {
        "title": "The lord of the rings",
        "author": "JRR Tolkien",
        "url": "www.lecturasGarbanzos.com",
        "likes": 10
    },
    {
        "title": "The witcher",
        "author": " Andrzej Sapkowski",
        "url": "www.lecturasMagicas.com",
        "likes": 15
    },
    {
        "title": "Harry potter",
        "author": "JK rowling",
        "url": "www.lecturasLebiosas.com",
        "likes": 20
    },
    {
        "title": "Alicia en el pais de las maravillas",
        "author": "Lewis Carroll",
        "url": "www.lecturasFumadas.com",
        "likes": 25
    },
    {
        "title": "La tejedora de coronas",
        "author": "Germán Espinosa",
        "url": "www.lecturasFumadas.com",
        "likes": 30
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')
    for (const blog of initialBlogs) {
        const blogObject = new Blog(blog)
        await blogObject.save()
        console.log('saved')
    }
    console.log('done')
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are five blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 5)
})

test('blogs have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})


test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert(titles.includes('The lord of the rings'))
})

test('a valid blog can be added', async () => {

    const initialResponse = await api.get('/api/blogs')
    const initialBlogs = initialResponse.body.length

    const newBlog = {
        "title": "El lobo estepario",
        "author": "alguien",
        "url": "www.lecturasFumadas.com",
    }

    const postResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)


    assert.strictEqual(response.body.length, initialBlogs + 1)


    assert(titles.includes('El lobo estepario'))
})

test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: "Como cazar a un riusenor",
        author: "no se",
        url: "www.lecturasFilosoficas.com",
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const createdBlog = response.body
    assert.strictEqual(createdBlog.likes, 0)
})
test('if title or url is missing, it returns 400 Bad Request', async () => {
    const newBlog = {
        author: "Sin título ni url"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})


test('a blog can be deleted', async () => {

    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    assert(blogToDelete.id, 'Blog ID must exist')


    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)


    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

    const ids = blogsAtEnd.body.map(blog => blog.id)
    assert(!ids.includes(blogToDelete.id))
})

test('a blog\'s likes can be updated', async () => {

    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[4]


    const updatedLikes = { likes: blogToUpdate.likes + 1 }


    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/)


    assert.strictEqual(response.body.likes, updatedLikes.likes)
})




after(async () => {
    await mongoose.connection.close()
})

