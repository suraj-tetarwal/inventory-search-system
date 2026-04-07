const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// Database file location
const dbPath = path.join(__dirname, 'inventory.db');

let db;

async function initializeDb() {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('Database connected successfully');

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await db.exec(schema);
        console.log('Database tables initialized');

        return db;
    } catch (err) {
        console.error('Database initialization error:', err);
        throw err;
    }
}

module.exports = { initializeDb, getDb: () => db };
