const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' });
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  });
  

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    
    const id = request.params.id;
    const deletedBlog = await Blog.findByIdAndRemove(id)
    
    
    if (deletedBlog) {
      response.status(204).end();
    } 
  } catch (error) {
    response.status(404).json({ error: 'Blog not found' })
  }
})

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