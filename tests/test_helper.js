const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        title: 'The Art of Computer Programming',
        author: 'Donald E. Knuth',
        url: 'http://www-cs-faculty.stanford.edu/~uno/taocp.html',
        likes: 10,
        __v: 1
    },
    {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        url: 'https://mitpress.mit.edu/books/introduction-algorithms',
        likes: 7,
        __v: 2
    },
    {
        title: 'Go nowhere',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 6,
        __v: 0
    },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}