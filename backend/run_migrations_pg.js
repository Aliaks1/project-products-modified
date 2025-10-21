require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set. Abort.');
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

async function runFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log('Running', filePath);
  await client.query(sql);
}

(async () => {
  try {
    await client.connect();
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      await runFile(path.join(migrationsDir, f));
    }
    console.log('Postgres migrations finished.');
    await client.end();
  } catch (e) {
    console.error('Migration error:', e);
    process.exit(1);
  }
})();
