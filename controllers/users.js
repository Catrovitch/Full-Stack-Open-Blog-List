const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs')

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const user = await User.findById(id)

  if (!user) {
    return response.status(404).json({error: 'No use with given id'})
  }
  response.status(201).json(user)
})


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password are required.' });
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long.' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});


module.exports = usersRouter