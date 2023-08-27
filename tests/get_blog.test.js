const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const data = require('./test_data')

describe('GET Blogs Tests', () => {
beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blogData of data.initialBlogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    
  })



test('blogs are returned as json', async () => {

    const response = await api.get('/api/blogs')

    console.log('Response.body: ', response.body)

    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(data.initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].title).toBe('Go To Statement Considered Harmful')
})

afterAll(async () => {
  await mongoose.connection.close()
  })
})