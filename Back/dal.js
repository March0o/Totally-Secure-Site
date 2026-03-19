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
      const query = `INSERT INTO users (username, password, email, role, balance) VALUES ('${username}', '${password}', '${email}', NULL, 100)`;
      db.run(query, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  },

  // Create a new post
  createPost: (userId, comment) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO posts (userId, comment) VALUES ('${userId}', '${comment})'`;
      db.run(query, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  },

  // Find user by username & password (login)
  findUser: (username, password) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Get user by ID
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE id = '${id}'`;
      db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Find user by username & password (login)
  getPosts: (search) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM posts WHERE comment LIKE '%${search}%'`;
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};