const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Initialize table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    email TEXT,
    role TEXT,
    balance REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    comment TEXT
  )`);
});

db.run(`INSERT INTO users (username, password, email, role, balance) VALUES ('admin', 'admin', 'admin@email.com', 'ADMIN', 9999)`);
db.run(`INSERT INTO posts (userId, comment) VALUES (1,'ADMIN MESSAGE')`);

// Methods to export
module.exports = {

  // Create a new user
  createUser: (username, password, email) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (username, password, email, role, balance) VALUES (?, ?, ?, NULL, 100)`;
      db.run(query, [username, password, email], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  },

  // Create a new post
  createPost: (userId, comment) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO posts (userId, comment) VALUES (?, ?)`;
      db.run(query, [userId, comment], function(err) {
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

  // Find user by username & password (login)
  getPosts: (search) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM posts WHERE comment LIKE ?`;
      db.all(query, [`%${search}%`], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};