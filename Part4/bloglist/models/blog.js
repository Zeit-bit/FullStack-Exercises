const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
},
{
  toJSON: {
    transform: (document, returnedObj) => {
      returnedObj.id = document._id
      delete returnedObj._id
      delete returnedObj.__v
    }
  }
})

module.exports = mongoose.model('Blog', blogSchema)
