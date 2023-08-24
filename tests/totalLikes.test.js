const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
    }
]

const listWithManyBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'The Art of Computer Programming',
        author: 'Donald E. Knuth',
        url: 'http://www-cs-faculty.stanford.edu/~uno/taocp.html',
        likes: 10,
        __v: 1
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        url: 'https://mitpress.mit.edu/books/introduction-algorithms',
        likes: 7,
        __v: 2
    },
    {
        _id: '5a422aa71b54a676234d234f8',
        title: 'Go nowhere',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 6,
        __v: 0
    },
];
  
describe('Total likes', () => {
    test('of empty list is zero', () => {
      const blogs = []
  
      const result = listHelper.totalLikes(blogs)
      expect(result).toBe(0)
    })
    
    test('when list has only one blog, equals the likes of that', () => {

        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has many blogs, equals the likes of that', () => {

        const result = listHelper.totalLikes(listWithManyBlogs)
        expect(result).toBe(28)
    })
})

describe('Most popular blog', () => {
    test('when list of blogs is empty', () => {
        const blogs = []
        const result = listHelper.favouriteBlog(blogs)
        expect(result).toEqual(null)
    })
    test('when list has one blog in it', () => {
        const result = listHelper.favouriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })
    test('when list has many blogs in it', () => {
        const result = listHelper.favouriteBlog(listWithManyBlogs)
        expect(result).toEqual(listWithManyBlogs[1])
    })
})


describe('mostBlogs', () => {
  test('should return null for an empty list', () => {
    const emptyList = [];
    const result = listHelper.mostBlogs(emptyList);
    expect(result).toBeNull();
  });

  test('should return the author and blogs count for a list with one object', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 });
  });

  test('should return the author and blogs count for a list with many objects', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs);
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 2 });
  });
});
describe('mostLikes', () => {
    test('should return null for an empty list', () => {
      const emptyList = [];
      const result = listHelper.mostLikes(emptyList);
      expect(result).toBeNull();
    });
  
    test('should return the author and blogs count for a list with one object', () => {
      const result = listHelper.mostLikes(listWithOneBlog);
      expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 });
    });
  
    test('should return the author and blogs count for a list with many objects', () => {
      const result = listHelper.mostLikes(listWithManyBlogs);
      expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 11 });
    });
});
