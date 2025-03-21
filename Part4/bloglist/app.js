const express = require('express')
const app = express()
const blogRouter = require('./controllers/blogs')
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.error('Connection failed', error)
})

app.use(cors())
app.use(express.json())
app.use(blogRouter)

module.exports = app
