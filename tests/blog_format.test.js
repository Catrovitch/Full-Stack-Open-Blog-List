const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const data = require('./test_data')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

describe('Formating Blogs Tests', () => {
beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blogData of data.initialBlogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    
  })

test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs');
    
    expect(response.body).toHaveLength(data.initialBlogs.length);
    
    for (const blog of response.body) {
        expect(blog.id).toBeDefined();
        expect(blog._id).toBeUndefined();
    }
    });

afterAll(async () => {
    await mongoose.connection.close()
    })
})