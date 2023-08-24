const dummy = (blogs) => {
  return 1
}

function totalLikes(objects) {
  const amountOfLikes = objects.reduce((accumulator, obj) => {
    if (obj.hasOwnProperty('likes')) {
      return accumulator + obj.likes;
    }
    return accumulator;
  }, 0);

  return amountOfLikes;
}

function favouriteBlog(objects) {
  if (objects.length === 0) {
    return null;
  }

  return objects.reduce((mostLiked, obj) => {
    if (obj.hasOwnProperty('likes') && obj.likes > mostLiked.likes) {
      return obj;
    }
    return mostLiked;
  }, objects[0]);
}

function mostBlogs(blogList) {
  if (blogList.length === 0) {
    return null;
  }

  const authorCounts = {};

  for (const blog of blogList) {
    if (blog.hasOwnProperty('author')) {
      if (authorCounts[blog.author]) {
        authorCounts[blog.author]++;
      } else {
        authorCounts[blog.author] = 1;
      }
    }
  }

  const mostBlogsInfo = Object.keys(authorCounts).reduce((most, author) => {
    if (authorCounts[author] > (most.blogs || 0)) {
      most.author = author;
      most.blogs = authorCounts[author];
    }
    return most;
  }, {});

  return mostBlogsInfo;
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}