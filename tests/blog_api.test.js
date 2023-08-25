const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('Go To Statement Considered Harmful')
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Jobs Blog',
        author: 'Steve Jobs',
        url: 'example.com',
        likes: 6
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    
    const title = response.body.map(r => r.title)
    
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(title).toContain(
        'Jobs Blog'
    )
    })
    
test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs');
    
    expect(response.body).toHaveLength(helper.initialBlogs.length);
    
    for (const blog of response.body) {
        expect(blog.id).toBeDefined();
        expect(blog._id).toBeUndefined();
    }
    });

test('blog without likes defaults to 0', async () => {
    const newBlog = {
        title: 'The One Blog to Rule them all',
        author: 'Sauron',
        url: 'sauron.com'
    };
    
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    expect(response.body.likes).toBe(0);
    
    const savedBlog = await Blog.findById(response.body.id);
    expect(savedBlog.likes).toBe(0);
    });

test('missing title or url should result in 400 Bad Request', async () => {
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
        .send(newBlogMissingTitle)
        .expect(400);
    
    await api
        .post('/api/blogs')
        .send(newBlogMissingUrl)
        .expect(400);
    });

test('deleting a blog returns status 204 if successful', async () => {
    const blogs = await api.get('/api/blogs');
    const blogToDelete = blogs.body[0];
    
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);
    
    const updatedBlogs = await api.get('/api/blogs');
    expect(updatedBlogs.body).toHaveLength(blogs.body.length - 1);
    });
    
test('deleting a non-existent blog returns status 404', async () => {
const nonExistentId = 'nonexistentid123';

await api
    .delete(`/api/blogs/${nonExistentId}`)
    .expect(404);
});

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