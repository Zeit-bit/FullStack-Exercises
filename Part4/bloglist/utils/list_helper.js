const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfLikes = (sum, blog) => { return sum + blog.likes }

  return blogs.reduce(sumOfLikes, 0)
}

module.exports = {
  dummy,
  totalLikes
}
