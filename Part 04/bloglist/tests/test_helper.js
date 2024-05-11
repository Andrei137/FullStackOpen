const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'https://www.example.com',
    likes: 10,
  },
  {
    title: 'Browser can execute only Javascript',
    author: 'John Noe',
    url: 'https://www.example.com',
    likes: 20,
  }
]

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'salainen'
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://www.example.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getToken = async (api, user) => {
  const response = await api
    .post('/api/login')
    .send(user)
    .expect(200)

  return response.body.token
}

module.exports = {
  nonExistingId,
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
  getToken
}