const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.db');
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

/* helpers */
function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}
function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
function getSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

/* validation */
function validateBook(body) {
  const errors = [];
  if (!body.title || String(body.title).trim().length < 1) errors.push('title is required');
  if (!body.author || String(body.author).trim().length < 1) errors.push('author is required');
  if (!body.genre || String(body.genre).trim().length < 1) errors.push('genre is required');
  if (body.year === undefined || isNaN(Number(body.year))) errors.push('year must be a number');
  if (body.rating === undefined || isNaN(Number(body.rating))) errors.push('rating must be a number between 0 and 5');
  else if (Number(body.rating) < 0 || Number(body.rating) > 5) errors.push('rating must be between 0 and 5');
  return errors;
}

/* endpoints */
/* GET /api/books */
app.get('/api/books', async (req, res) => {
  try {
    const rows = await allSql('SELECT * FROM books ORDER BY id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/* GET /api/books/:id */
app.get('/api/books/:id', async (req, res) => {
  try {
    const row = await getSql('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'book_not_found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/* POST /api/books */
app.post('/api/books', async (req, res) => {
  try {
    const body = req.body;
    const errors = validateBook(body);
    if (errors.length) return res.status(400).json({ errors });
    const { id } = await runSql(
      'INSERT INTO books (title, author, genre, year, rating) VALUES (?, ?, ?, ?, ?)',
      [body.title, body.author, body.genre, Number(body.year), Number(body.rating)]
    );
    const created = await getSql('SELECT * FROM books WHERE id = ?', [id]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/* PUT /api/books/:id */
app.put('/api/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getSql('SELECT * FROM books WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'book_not_found' });
    const body = req.body;
    const errors = validateBook(body);
    if (errors.length) return res.status(400).json({ errors });
    await runSql('UPDATE books SET title=?, author=?, genre=?, year=?, rating=? WHERE id = ?',
      [body.title, body.author, body.genre, Number(body.year), Number(body.rating), id]);
    const updated = await getSql('SELECT * FROM books WHERE id = ?', [id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/* DELETE /api/books/:id */
app.delete('/api/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getSql('SELECT * FROM books WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'book_not_found' });
    await runSql('DELETE FROM books WHERE id = ?', [id]);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/* serve frontend fallback */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});