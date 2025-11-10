const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
  let newBookId;

  test('GET /api/books - should return all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/books/:id - should return a book by ID', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  test('GET /api/books/:id - should return 404 for non-existent ID', async () => {
    const res = await request(app).get('/api/books/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/books - should create a new book', async () => {
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Test Genre',
      copiesAvailable: 4
    };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Book');
    newBookId = res.body.id;
  });

  test('PUT /api/books/:id - should update an existing book', async () => {
    const updatedBook = {
      title: 'Updated Test Book',
      copiesAvailable: 10
    };
    const res = await request(app).put(`/api/books/${newBookId}`).send(updatedBook);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Test Book');
    expect(res.body.copiesAvailable).toBe(10);
  });

  test('DELETE /api/books/:id - should delete a book', async () => {
    const res = await request(app).delete(`/api/books/${newBookId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', newBookId);
  });

  test('DELETE /api/books/:id - should return 404 for non-existent book', async () => {
    const res = await request(app).delete('/api/books/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
