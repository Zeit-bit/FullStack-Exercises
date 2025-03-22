const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfLikes = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(sumOfLikes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  const mostVotedQty = Math.max(...blogs.map((blog) => blog.likes))
  const mostVotedBlog = blogs.find((blog) => blog.likes === mostVotedQty)
  delete mostVotedBlog._id
  delete mostVotedBlog.__v
  delete mostVotedBlog.url
  return mostVotedBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorBlogCounts = []
  blogs.forEach((blog) => {
    const indexOfMatchingAuthor = authorBlogCounts.findIndex(
      (search) => search.author === blog.author
    )

    if (indexOfMatchingAuthor !== -1) {
      authorBlogCounts[indexOfMatchingAuthor].blogs++
    } else {
      authorBlogCounts.push({ author: blog.author, blogs: 1 })
    }
  })

  const maxBlogCount = Math.max(...authorBlogCounts.map((obj) => obj.blogs))
  return authorBlogCounts.find((obj) => obj.blogs === maxBlogCount)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorBlogLikes = []
  blogs.forEach((blog) => {
    const indexOfMatchingAuthor = authorBlogLikes.findIndex(
      (search) => search.author === blog.author
    )

    if (indexOfMatchingAuthor !== -1) {
      authorBlogLikes[indexOfMatchingAuthor].likes += blog.likes
    } else {
      authorBlogLikes.push({ author: blog.author, likes: blog.likes })
    }
  })

  const maxBlogLikes = Math.max(...authorBlogLikes.map((obj) => obj.likes))
  return authorBlogLikes.find((obj) => obj.likes === maxBlogLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
