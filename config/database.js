const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../data/database.sqlite');

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeTables();
    }
});

// Initialize database tables
function initializeTables() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'member' CHECK(role IN ('member', 'owner')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('✅ Users table ready');
            createDefaultOwner();
        }
    });

    // Contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'closed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating contacts table:', err.message);
        } else {
            console.log('✅ Contacts table ready');
        }
    });
}

// Create default owner account
function createDefaultOwner() {
    const bcrypt = require('bcryptjs');
    const defaultOwner = {
        username: 'arijit_panda',
        email: 'extrabenefit1@gmail.com',
        password: 'admin123', // Change this in production!
        role: 'owner'
    };

    // Hash password
    const hashedPassword = bcrypt.hashSync(defaultOwner.password, 10);

    // Check if owner already exists
    db.get("SELECT id FROM users WHERE role = 'owner'", (err, row) => {
        if (err) {
            console.error('Error checking owner:', err.message);
        } else if (!row) {
            // Insert default owner
            db.run(`INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [defaultOwner.username, defaultOwner.email, hashedPassword, defaultOwner.role],
                function(err) {
                    if (err) {
                        console.error('Error creating default owner:', err.message);
                    } else {
                        console.log('✅ Default owner account created');
                        console.log('👤 Username: arijit_panda');
                        console.log('🔑 Password: admin123');
                        console.log('⚠️  Change this password in production!');
                    }
                }
            );
        } else {
            console.log('✅ Owner account already exists');
        }
    });
}

// Database helper functions
const dbHelper = {
    // Run a query with parameters
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    },

    // Get a single row
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    // Get multiple rows
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};

module.exports = { db, dbHelper };
