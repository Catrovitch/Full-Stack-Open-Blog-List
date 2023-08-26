const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,

})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject.blogs) {
      returnedObject.blogs = returnedObject.blogs.map(blog => ({
        url: blog.url,
        title: blog.title,
        author: blog.author,
        id: blog.id.toString()
      }));
    }

    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});



userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User