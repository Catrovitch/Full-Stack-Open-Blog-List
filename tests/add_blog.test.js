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

describe('Adding Blog Tests', () => {
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    for (const blogData of data.initialBlogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    const passwordHash = await bcrypt.hash('IWantTheRing123', 10)
    const user = new User({ username: 'Saruman', passwordHash })

    await user.save()
    
  })


test('a valid blog can be added', async () => {
    const user = await User.findOne({ username: 'Saruman' })
    const token = jwt.sign({ id: user._id }, process.env.SECRET)

    const newBlog = {
        title: 'Jobs Blog',
        author: 'Steve Jobs',
        url: 'example.com',
        likes: 6
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) 
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    expect(response.body).toHaveLength(data.initialBlogs.length + 1)
    expect(title).toContain('Jobs Blog')
})

test('blog without likes defaults to 0', async () => {
    const user = await User.findOne({ username: 'Saruman' })
    const token = jwt.sign({ id: user._id }, process.env.SECRET)
    
    
    const newBlog = {
        title: 'Jobs Blog',
        author: 'Steve Jobs',
        url: 'example.com'
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)    
    
    expect(response.body.likes).toBe(0);
})

test('missing title or url should result in 400 Bad Request', async () => {
    const user = await User.findOne({ username: 'Saruman' })
    const token = jwt.sign({ id: user._id }, process.env.SECRET)

    const newBlogMissingTitle = {
        author: 'Test Author',
        url: 'testurl.com',
        likes: 5
    };
    
    const newBlogMissingUrl = {
        title: 'Test Title',
        author: 'Test Author',
        likes: 5
    };
    
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogMissingTitle)
        .expect(400);
    
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogMissingUrl)
        .expect(400);
    });

afterAll(async () => {
    await mongoose.connection.close()
    })
})