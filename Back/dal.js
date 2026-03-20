const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2');
const crypto = require('crypto');

const db = new sqlite3.Database('./database.db');

async function init() {
  const adminPasswordHash = await argon2.hash('admin', { type: argon2.argon2id });
  const user1PasswordHash = await argon2.hash('user1', { type: argon2.argon2id });
  const user2PasswordHash = await argon2.hash('user2', { type: argon2.argon2id });
  const user3PasswordHash = await argon2.hash('user3', { type: argon2.argon2id });

  db.serialize(() => {
    // User Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      email TEXT,
      role TEXT,
      balance REAL
    )`);

    // Post Table
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      comment TEXT
    )`);

    // Session Table
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER TEXT PRIMARY KEY,
      userId INTEGER,
      createdAt INTEGER,
      expiresAt INTEGER
    )`);

    populateDB(adminPasswordHash, user1PasswordHash, user2PasswordHash, user3PasswordHash);
  });
}

function populateDB(adminPasswordHash, user1PasswordHash, user2PasswordHash, user3PasswordHash) {
  // Sample Users
  db.run(`INSERT INTO users (username, password, email, role, balance) VALUES ('admin', ?, 'admin@email.com', 'ADMIN', 9999)`, [adminPasswordHash]);
  db.run(`INSERT INTO users (username, password, email, role, balance) VALUES ('user1', ?, 'user1@email.com', NULL, 324)`, [user1PasswordHash]);
  db.run(`INSERT INTO users (username, password, email, role, balance) VALUES ('user2', ?, 'user2@email.com', NULL, 124)`, [user2PasswordHash]);
  db.run(`INSERT INTO users (username, password, email, role, balance) VALUES ('user3', ?, 'user3@email.com', NULL, 354)`, [user3PasswordHash]);

  // Sample Posts
  db.run(`INSERT INTO posts (userId, comment) VALUES (1,'ADMIN MESSAGE')`);
  db.run(`INSERT INTO posts (userId, comment) VALUES (2,'Hey Guys :D')`);
  db.run(`INSERT INTO posts (userId, comment) VALUES (3,'Hello Guy')`);
  db.run(`INSERT INTO posts (userId, comment) VALUES (4,'How is everyone??')`);
}

init()

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

  // Check existing user
  checkAccount: (email, username) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
      db.get(query, [email, username], function(err, row) {
        if (err) reject(err);
        else resolve(!!row);
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

  // Find user by username (login)
  findUser: (username) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE username = ?`;
      db.get(query, [username], (err, row) => {
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

  // Get Posts
  getPosts: (search) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM posts WHERE comment LIKE ?`;
      db.all(query, [`%${search}%`],(err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Create new/log session
  logSession: (userId) => {
    return new Promise((resolve, reject) => {
      const sessionId = crypto.randomBytes(32).toString('hex');

      const createdAt = Math.floor(Date.now() / 1000);
      const expiresAt = createdAt + 86400; // 1 day

      const query = `INSERT INTO sessions (id, userId, createdAt, expiresAt) VALUES (?, ?, ?, ?)`;
      db.run(query, [sessionId, userId, createdAt, expiresAt],(err, rows) => {
        if (err) reject(err);
        else resolve(sessionId);
      });
    });
  },

  // Get Session information
  getSession: (sessionId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, userId, createdAt, expiresAt FROM sessions WHERE id = ?`;
      db.get(query, [sessionId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};