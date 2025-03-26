const supertest = require('supertest')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

describe('When there are blogs in the database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog in initialBlogs) {
      const newBlog = new Blog(initialBlogs[blog])
      await newBlog.save()
    }
  })

  describe('When using GET /api/blogs', () => {
    test('the amount of blogs returned is correct', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('the returned blogs are in json format', async () => {
      await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('the blogs have correct id format', async () => {
      const blogs = (await api.get('/api/blogs')).body
      const blogsWithCorrectIds = blogs.filter(blog => !blog._id && blog.id)
      assert.strictEqual(blogsWithCorrectIds.length, initialBlogs.length)
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

      assert.strictEqual(blogs.length, initialBlogs.length + 1)
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

  after(async () => {
    await mongoose.connection.close()
  })
})
