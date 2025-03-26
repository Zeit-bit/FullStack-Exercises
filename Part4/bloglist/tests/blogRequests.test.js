const supertest = require('supertest')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./blogtest_helper')
const api = supertest(app)

describe('When there are blogs in the database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog in helper.initialBlogs) {
      const newBlog = new Blog(helper.initialBlogs[blog])
      await newBlog.save()
    }
  })

  describe('When using GET /api/blogs', () => {
    test('the amount of blogs returned is correct', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('the returned blogs are in json format', async () => {
      await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('the blogs have correct id format', async () => {
      const blogs = (await api.get('/api/blogs')).body
      const blogsWithCorrectIds = blogs.filter(blog => !blog._id && blog.id)
      assert.strictEqual(blogsWithCorrectIds.length, helper.initialBlogs.length)
    })
  })

  describe('When using POST /api/blogs', () => {
    test('the amount of blogs returned is increased by one', async () => {
      const newBlog = {
        title: 'Backend Tests & Async/Await',
        author: 'John Frusciante',
        url: 'https://www.youtube.com/watch?v=GLvohMXgcBo',
        likes: 250
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = (await api.get('/api/blogs')).body
      const { id, _id, __v, ...blogSaved } = blogs[blogs.length - 1]

      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
      assert.deepStrictEqual(blogSaved, newBlog)
    })

    test('if likes property is missing, it defaults to zero', async () => {
      const newBlog = {
        title: 'Testing a blog without likes property',
        author: 'Cesar Sosa',
        url: 'http://localhost:3001'
      }

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const expectedBlog = { ...newBlog, likes: 0 }
      const { id, _id, __v, ...blogSaved } = response.body

      assert.deepStrictEqual(blogSaved, expectedBlog)
    })

    test('if url property is missing, server responds with 400 Bad request', async () => {
      const newBlog = {
        title: 'Testing a blog without URL',
        author: 'Orlando Smith',
        likes: 0
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('if title property is missing, server responds with 400 Bad request', async () => {
      const newBlog = {
        author: 'Tyler Smith',
        url: 'http://Testing-a-blog-without-title',
        likes: 0
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('When using DELETE /api/blogs/:id', () => {
    describe('If id exists:', () => {
      test('the amount of blogs is decreased by one', async () => {
        const blogs = await helper.getAllBlogsFromDB()
        const idToDelete = blogs[blogs.length - 1].id
        await api.delete(`/api/blogs/${idToDelete}`).expect(204)
        const updatedBlogs = await helper.getAllBlogsFromDB()
        assert.strictEqual(updatedBlogs.length, helper.initialBlogs.length - 1)
      })

      test('the updated database does not contain the blog deleted', async () => {
        const blogs = await helper.getAllBlogsFromDB()
        const idToDelete = blogs[blogs.length - 1].id
        await api.delete(`/api/blogs/${idToDelete}`).expect(204)
        const updatedBlogs = await helper.getAllBlogsFromDB()
        const ids = updatedBlogs.map(blog => blog.id)
        assert(!ids.includes(idToDelete))
      })
    })

    test('if id is not found, server returns 404 Not found', async () => {
      const nonExistingID = await helper.nonExistingID()
      await api.delete(`/api/blogs/${nonExistingID}`).expect(404)
    })

    test('if id is malformatted, server returns 400 Bad Request', async () => {
      const malformattedID = '-1'
      await api.delete(`/api/blogs/${malformattedID}`).expect(400)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
