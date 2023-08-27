const Blog = require('../models/blog')
const User = require('../models/user')
const Data = require('./test_data')


const createUsers = async () => {
  const userData = Data.initialUsers

  for (let user of userData) {
    let userObject = new User(user)
    await userObject.save()
  }
}

const createBlogs = async () => {
  for (const blogData of Data.initialBlogs) {
    const blog = new Blog(blogData);
    await blog.save();
  }
};

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  createUsers, 
  nonExistingId, 
  blogsInDb,
  createBlogs
}