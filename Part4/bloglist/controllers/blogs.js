const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/api/blogs/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  if (!deletedBlog) return response.status(404).end()
  response.status(204).end()
})

blogRouter.put('/api/blogs/:id', async (request, response) => {
  const blogReturned = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: request.body.likes },
    { new: true, runValidators: true })

  if (!blogReturned) return response.status(404).end()
  response.json(blogReturned)
})

module.exports = blogRouter
