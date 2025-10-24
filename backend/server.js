const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

function initDb() {
  const dbFile = path.join(__dirname, 'data.db');
  const dbExists = fs.existsSync(dbFile);
  const db = new sqlite3.Database(dbFile);

  if (!dbExists) {
    console.log('📘 Baza danych nie istnieje – tworzę nową...');
    try {
      const migration = fs.readFileSync(
        path.join(__dirname, 'migrations', '001_create_books.sql'),
        'utf8'
      );
      db.exec(migration, (err) => {
        if (err) console.error('❌ Błąd przy tworzeniu tabeli:', err);
        else console.log('✅ Tabela books została utworzona');
      });
    } catch (err) {
      console.error('❌ Błąd podczas odczytu pliku migracji:', err);
    }
  } else {
    console.log('📗 Połączenie z istniejącą bazą danych...');
  }

  return db;
}

const db = initDb();

app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      console.error('Błąd przy pobieraniu danych:', err);
      return res
        .status(500)
        .json({ error: 'internal_server_error', detail: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/books', (req, res) => {
  const { title, author, genre, year, rating } = req.body;
  db.run(
    'INSERT INTO books (title, author, genre, year, rating) VALUES (?, ?, ?, ?, ?)',
    [title, author, genre, year, rating],
    function (err) {
      if (err) {
        console.error('Błąd przy dodawaniu książki:', err);
        return res
          .status(500)
          .json({ error: 'internal_server_error', detail: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year, rating } = req.body;
  db.run(
    'UPDATE books SET title=?, author=?, genre=?, year=?, rating=? WHERE id=?',
    [title, author, genre, year, rating, id],
    function (err) {
      if (err) {
        console.error('Błąd przy edycji książki:', err);
        return res
          .status(500)
          .json({ error: 'internal_server_error', detail: err.message });
      }
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM books WHERE id=?', [id], function (err) {
    if (err) {
      console.error('Błąd przy usuwaniu książki:', err);
      return res
        .status(500)
        .json({ error: 'internal_server_error', detail: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
});
