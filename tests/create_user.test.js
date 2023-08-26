const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('POST /api/users', () => {
  afterAll(async () => {
    await mongoose.connection.close()
  })

  test('creates a new user with valid data', async () => {
    const newUser = {
      username: 'john_doe',
      name: 'John Doe',
      password: 'password123',
    };

    const response = await supertest(app).post('/api/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.name).toBe(newUser.name);
  });


  test('returns 400 if username is missing', async () => {
    const userWithoutUsername = {
      name: 'Alice Smith',
      password: 'securepass',
    };

    const response = await supertest(app).post('/api/users').send(userWithoutUsername);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and password are required.');
  });

  test('returns 400 if password is missing', async () => {
    const userWithoutPassword = {
      username: 'alice_smith',
      name: 'Alice Smith',
    };

    const response = await supertest(app).post('/api/users').send(userWithoutPassword);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and password are required.');
  });

  test('returns 400 if username is too short', async () => {
    const userWithShortUsername = {
      username: 'ab',
      name: 'Short Username',
      password: 'securepass',
    };

    const response = await supertest(app).post('/api/users').send(userWithShortUsername);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and password must be at least 3 characters long.');
  });

  test('returns 400 if password is too short', async () => {
    const userWithShortPassword = {
      username: 'user123',
      name: 'User with Short Password',
      password: 'ab',
    };

    const response = await supertest(app).post('/api/users').send(userWithShortPassword);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and password must be at least 3 characters long.');
  });

  test('returns 400 if username is not unique', async () => {
    const existingUser = {
      username: 'existing_user',
      name: 'Existing User',
      password: 'existingpass',
    };

    await supertest(app).post('/api/users').send(existingUser);

    const duplicateUser = {
      username: 'existing_user',
      name: 'Duplicate User',
      password: 'duplicatepass',
    };

    const response = await supertest(app).post('/api/users').send(duplicateUser);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User validation failed: username: Error, expected `username` to be unique. Value: `existing_user`');
  });
});
