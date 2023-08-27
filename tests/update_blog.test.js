const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const data = require('./test_data')

describe('Updating Blogs Tests', () => {
beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of data.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

test('updating likes of a blog', async () => {
    const blogs = await api.get('/api/blogs');
    const blogToUpdate = blogs.body[0];
  
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    };
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);
  
    expect(response.body.likes).toBe(updatedBlog.likes);
  
    const updatedBlogInDB = await Blog.findById(blogToUpdate.id);
    expect(updatedBlogInDB.likes).toBe(updatedBlog.likes);
});
  
test('updating likes of a non-existent blog returns status 404', async () => {
const nonExistentId = 'nonexistentid123';
const updatedBlog = {
    likes: 42
};

await api
    .put(`/api/blogs/${nonExistentId}`)
    .send(updatedBlog)
    .expect(404);
});

afterAll(async () => {
    await mongoose.connection.close()
    })
})