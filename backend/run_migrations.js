const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.db');
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

console.log('DB file:', DB_FILE);

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Failed to open DB', err);
    process.exit(1);
  }
});

function runSql(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      console.log('Applied', path.basename(filePath));
      resolve();
    });
  });
}

(async () => {
  try {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      await runSql(path.join(MIGRATIONS_DIR, f));
    }
    console.log('Migrations finished.');
    db.close();
  } catch (e) {
    console.error('Migration error:', e);
    process.exit(1);
  }
})();