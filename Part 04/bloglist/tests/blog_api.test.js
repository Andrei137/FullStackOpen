const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
      .expect(201)
    await api
      .post('/api/users')
      .send(helper.initialUsers[1])
      .expect(201)

    await Blog.deleteMany({})
    const user = await User.findOne({ username: helper.initialUsers[0].username })
    helper.initialBlogs[0].user = user._id.toString()
    helper.initialBlogs[1].user = user._id.toString()
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(blog.id)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const usersAtStart = await helper.usersInDb()

      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'John Poe',
        url: 'https://www.example.com',
        likes: 30,
        user: usersAtStart[0].id
      }

      const token = await helper.getToken(api, helper.initialUsers[0])

      let savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(savedBlog.body, {...newBlog, id: savedBlog.body.id, user: savedBlog.body.user})

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('likes property defaults to 0 if missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newBlog = {
        title: 'I am a blog without likes',
        author: 'John Moe',
        url: 'https://www.example.com',
        user: usersAtStart[0].id
      }

      const token = await helper.getToken(api, helper.initialUsers[0])

      const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(savedBlog.body.likes, 0)
    })

    test('blog without title is not added', async () => {
      const usersAtStart = await helper.usersInDb()

      const newBlog = {
        author: 'John Noe',
        url: 'https://www.example.com',
        likes: 10,
        user: usersAtStart[0].id
      }

      const token = await helper.getToken(api, helper.initialUsers[0])

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const usersAtStart = await helper.usersInDb()

      const newBlog = {
        title: 'I am a blog without url',
        author: 'John Boe',
        user: usersAtStart[0].id
      }

      const token = await helper.getToken(api, helper.initialUsers[0])

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without token returns 401', async () => {
      const usersAtStart = await helper.usersInDb()

      const newBlog = {
        title: 'I am a blog without token',
        author: 'John Poe',
        url: 'https://www.example.com',
        likes: 30,
        user: usersAtStart[0].id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, {...blogToView, user: blogToView.user.toString()})
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes * 2,
        user: blogToUpdate.user
      }

      const resultBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
      assert.deepStrictEqual(resultBlog.body, {...updatedBlog, id: blogToUpdate.id, user: blogToUpdate.user.toString()})
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const token = await helper.getToken(api, helper.initialUsers[0])

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
