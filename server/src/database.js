const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../whatsut.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      is_admin INTEGER DEFAULT 0,
      is_banned INTEGER DEFAULT 0
    )`);

    // Groups
    db.run(`CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      admin_id INTEGER,
      FOREIGN KEY(admin_id) REFERENCES users(id)
    )`);

    // Group Members
    db.run(`CREATE TABLE IF NOT EXISTS group_members (
      group_id INTEGER,
      user_id INTEGER,
      status TEXT DEFAULT 'pending', -- pending, approved
      PRIMARY KEY (group_id, user_id),
      FOREIGN KEY(group_id) REFERENCES groups(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Messages
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER, -- NULL if group message
      group_id INTEGER, -- NULL if private message
      content TEXT,
      file_path TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id),
      FOREIGN KEY(group_id) REFERENCES groups(id)
    )`);
  });
}

module.exports = db;
