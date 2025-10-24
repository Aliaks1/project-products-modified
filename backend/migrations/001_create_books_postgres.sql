-- PostgreSQL migration: create books table
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 0),
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5)
);
