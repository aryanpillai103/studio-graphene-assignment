const Database = require('better-sqlite3');
const path = require('path');

// Create or connect to SQLite database file
// path.join ensures it works on all operating systems
const db = new Database(path.join(__dirname, '..', 'tasks.db'));

// Enable WAL mode for better performance
// WAL = Write-Ahead Logging - allows simultaneous reads and writes
db.pragma('journal_mode = WAL');

// Create tasks table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

console.log('✅ Database connected and tasks table ready');

// Export the database instance so other files can use it
module.exports = db;