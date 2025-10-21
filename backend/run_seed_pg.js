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
    const seedsDir = path.join(__dirname, 'seeds');
    const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      await runFile(path.join(seedsDir, f));
    }
    console.log('Seeding finished.');
    await client.end();
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  }
})();