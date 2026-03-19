const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Initialize table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    email TEXT
  )`);
});

// db.run(`INSERT INTO users (username, password) VALUES ('admin', 'admin')`);

// Methods to export
module.exports = {

  // Create a new user
  createUser: (username, password, email) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
      db.run(query, [username, password, email], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  },

  // Find user by username & password (login)
  findUser: (username, password) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
      db.get(query, [username, password], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Get user by ID
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE id = ?`;
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Get all users (for demo purposes)
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

};