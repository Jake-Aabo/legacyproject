const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { hashPassword } = require('../utils/auth');

const DB_PATH = path.join(__dirname, '../database/users.db');
const BACKUP_PATH = path.join(__dirname, '../database/users.db.backup');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const sampleUsers = [
    { username: 'admin', password: 'admin123', email: 'admin@retrotech.com' },
    { username: 'john.doe', password: 'Password1', email: 'john@example.com' },
    { username: 'jane.smith', password: 'qwerty123', email: 'jane@example.com' },
    { username: 'test.user', password: 'test123', email: 'test@example.com' },
    { username: 'demo', password: 'demo', email: 'demo@example.com' },
    { username: 'alice', password: 'alice2024', email: 'alice@example.com' },
    { username: 'bob', password: 'bobsecure', email: 'bob@example.com' },
    { username: 'charlie', password: 'charlie123', email: 'charlie@example.com' },
    { username: 'david', password: 'david456', email: 'david@example.com' },
    { username: 'eve', password: 'evepassword', email: 'eve@example.com' },
    { username: 'frank', password: 'frank789', email: 'frank@example.com' },
    { username: 'grace', password: 'grace321', email: 'grace@example.com' },
    { username: 'henry', password: 'henry654', email: 'henry@example.com' },
    { username: 'iris', password: 'iris987', email: 'iris@example.com' },
    { username: 'jack', password: 'jack111', email: 'jack@example.com' }
];

function setupDatabase() {
    console.log('RetroTech Solutions Database Setup v2.3.0');
    console.log('=========================================');
    
    // Remove existing database files
    if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('Removed existing database file');
    }
    
    if (fs.existsSync(BACKUP_PATH)) {
        fs.unlinkSync(BACKUP_PATH);
        console.log('Removed existing backup file');
    }
    
    try {
        const db = new Database(DB_PATH);
        console.log('Created new database file');

        // Create users table
        const createTableSQL = `
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                reset_token TEXT,
                reset_token_expires DATETIME
            )
        `;

        db.exec(createTableSQL);
        console.log('Created users table');
        
        // Insert sample users
        const insertStmt = db.prepare('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)');
        
        console.log('\nInserting sample users:');
        console.log('Username       | Password      | Email');
        console.log('---------------|---------------|---------------------------');
        
        sampleUsers.forEach((user) => {
            const passwordHash = hashPassword(user.password, user.username);
            
            try {
                insertStmt.run(user.username, passwordHash, user.email);
                console.log(`${user.username.padEnd(14)} | ${user.password.padEnd(13)} | ${user.email}`);
            } catch (err) {
                console.error(`Error inserting user ${user.username}:`, err.message);
            }
        });
        
        console.log(`\nSuccessfully inserted ${sampleUsers.length} sample users`);
        
        // Create backup file
        createBackup(db);
    } catch (err) {
        console.error('Error creating database:', err.message);
        process.exit(1);
    }
}

function createBackup(db) {
    console.log('\nCreating database backup...');
    
    try {
        db.close();
        
        // Copy database file to backup location
        fs.copyFileSync(DB_PATH, BACKUP_PATH);
        console.log('Database backup created successfully');
        
        // Display database statistics
        displayStatistics();
        
        console.log('\n=========================================');
        console.log('Database setup completed successfully!');
        console.log('=========================================');
        console.log('\nYou can now start the application with:');
        console.log('  npm start');
        console.log('\nAvailable endpoints:');
        console.log('  http://localhost:3000/auth/login');
        console.log('  http://localhost:3000/auth/register');
        console.log('  http://localhost:3000/reset/reset-password');
        console.log('  http://localhost:3000/api/debug/users (DEBUG ONLY)');
        console.log('\nSample login credentials:');
        console.log('  Username: admin, Password: admin123');
        console.log('  Username: demo, Password: demo');
        console.log('  Username: test.user, Password: test123');
        
        console.log('\n⚠️  SECURITY NOTICE:');
        console.log('This system contains intentional vulnerabilities for educational purposes.');
        console.log('DO NOT use in production environments.');
    } catch (err) {
        console.error('Error creating backup:', err.message);
    }
}

function displayStatistics() {
    const stats = fs.statSync(DB_PATH);
    const backupStats = fs.statSync(BACKUP_PATH);
    
    console.log('\nDatabase Statistics:');
    console.log(`Main database size: ${stats.size} bytes`);
    console.log(`Backup database size: ${backupStats.size} bytes`);
    console.log(`Database location: ${DB_PATH}`);
    console.log(`Backup location: ${BACKUP_PATH}`);
    console.log(`Created: ${stats.birthtime.toISOString()}`);
}

// Run setup if this script is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };