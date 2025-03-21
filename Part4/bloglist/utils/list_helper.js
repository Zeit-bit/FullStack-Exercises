const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfLikes = (sum, blog) => { return sum + blog.likes }

  return blogs.reduce(sumOfLikes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  const mostVotedQty = Math.max(...blogs.map(blog => blog.likes))
  const mostVotedBlog = blogs.find(blog => blog.likes === mostVotedQty)
  delete mostVotedBlog._id
  delete mostVotedBlog.__v
  delete mostVotedBlog.url
  return mostVotedBlog
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
