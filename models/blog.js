const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  url: String,
  title: String,
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    if (returnedObject.user) {
      returnedObject.user = {
        username: returnedObject.user.username,
        name: returnedObject.user.name,
        id: returnedObject.user.id.toString()
      };
    }
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


module.exports = mongoose.model('Blog', blogSchema) 