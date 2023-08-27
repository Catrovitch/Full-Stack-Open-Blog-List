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

describe('Deleting Blogs Tests', () => {
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

    test('deleting a non-existent blog returns status 404', async () => {
        const nonExistentId = '65fb37fa947e139234b71c31'

        await api
            .delete(`/api/blogs/${nonExistentId}`)
            .expect(404);
        });


    test('deleting a blog returns status 204 if successful', async () => {
        const user = await User.findOne({ username: 'Saruman' })
        const token = jwt.sign({ id: user._id }, process.env.SECRET)
        
        const newBlog = {
            title: 'Jobs Blog',
            author: 'Steve Jobs',
            url: 'example.com',
            likes: 6
        }
        
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) 
            .send(newBlog)
        
        const blogToDelete = response.body; // Get the new blog object
        
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`) 
            .expect(204);
        });

    afterAll(async () => {
        await mongoose.connection.close()
        })
})