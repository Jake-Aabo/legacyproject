const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database/users.db');

class DatabaseWrapper {
    constructor() {
        try {
            this.db = new Database(DB_PATH);
            console.log('Connected to SQLite database');
            this.initializeTables();
        } catch (err) {
            console.error('Error opening database:', err.message);
        }
    }

    initializeTables() {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                reset_token TEXT,
                reset_token_expires DATETIME
            )
        `;

        try {
            this.db.exec(createUsersTable);
        } catch (err) {
            console.error('Error creating users table:', err.message);
        }
    }

    createUser(username, passwordHash, email, callback) {
        try {
            const stmt = this.db.prepare('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)');
            const result = stmt.run(username, passwordHash, email);
            if (callback) callback(null, result.lastInsertRowid);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    getUserByUsername(username, callback) {
        try {
            const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
            const result = stmt.get(username);
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    getUserByEmail(email, callback) {
        try {
            const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
            const result = stmt.get(email);
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    getAllUsers(callback) {
        try {
            const stmt = this.db.prepare('SELECT * FROM users');
            const result = stmt.all();
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    updateUserPassword(username, newPasswordHash, callback) {
        try {
            const stmt = this.db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
            const result = stmt.run(newPasswordHash, username);
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    setResetToken(username, token, expires, callback) {
        try {
            const stmt = this.db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE username = ?');
            const result = stmt.run(token, expires, username);
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    getUserByResetToken(token, callback) {
        try {
            const stmt = this.db.prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > datetime(\'now\')');
            const result = stmt.get(token);
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    clearResetToken(username, callback) {
        try {
            const stmt = this.db.prepare('UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE username = ?');
            const result = stmt.run(username);
            if (callback) callback(null, result);
        } catch (err) {
            if (callback) callback(err);
        }
    }

    close() {
        try {
            this.db.close();
            console.log('Database connection closed');
        } catch (err) {
            console.error('Error closing database:', err.message);
        }
    }
}

module.exports = new DatabaseWrapper();