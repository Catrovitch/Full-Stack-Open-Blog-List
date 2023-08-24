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

module.exports = {
  dummy,
  totalLikes
}