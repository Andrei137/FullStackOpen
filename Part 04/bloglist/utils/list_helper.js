var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return favorite.likes > blog.likes ? favorite : blog
  }
  const favoriteBlog = blogs.reduce(reducer, blogs[0])
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  no_blogs = _.countBy(blogs.map(blog => blog.author))
  best_author = _.maxBy(_.keys(no_blogs), (author) => no_blogs[author])
  return {
    author: best_author,
    blogs: no_blogs[best_author]
  }
}

const mostLikes = (blogs) => {
  authors = _.map(_.groupBy(blogs, 'author'), (blogs, author) => {
    return {
      author: author,
      likes: _.sumBy(blogs, 'likes')
    }
  })
  return _.maxBy(authors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}