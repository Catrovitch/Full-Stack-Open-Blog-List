const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  
  response.status(200).json(blogs);
});


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
   
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' });
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes === undefined ? 0 : body.likes 
  });
  

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})



blogsRouter.delete('/:id', async (request, response) => {

  try {
    const id = request.params.id;
    const deletedBlog = await Blog.findById(id);

    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    
    if (deletedBlog.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'unauthorized operation' });
    }

    if (deletedBlog.user.toString() !== request.user.id) {
      return response.status(401).json({ error: 'unauthorized operation' });
    }

    await Blog.findByIdAndRemove(id)

    response.status(204).end();
  } catch (error) {

    response.status(500).json({ error: 'An error occurred' });
  }
});


blogsRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const updatedLikes = request.body.likes;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes: updatedLikes },
      { new: true } 
    );

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    response.status(404).json({ error: 'Internal server error' });
  }
});

module.exports = blogsRouter