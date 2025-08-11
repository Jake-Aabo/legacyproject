# Claude Code Prompt: Legacy Authentication System

## Project Overview
Create a Node.js authentication system called "LegacyAuth v2.3" by "RetroTech Solutions" - a company that hasn't updated their security since 2010. This is an educational project to demonstrate common authentication vulnerabilities. The system should appear to be a real production system but contain intentionally vulnerable implementations for security education purposes.

## Project Requirements

### Initial Setup
Create a new Node.js project with the following structure:
```
legacy-auth-system/
├── app.js
├── package.json
├── .env.example
├── database/
│   ├── users.db
│   └── users.db.backup
├── routes/
│   ├── auth.js
│   ├── reset.js
│   └── debug.js
├── utils/
│   ├── auth.js
│   ├── reset.js
│   └── db.js
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── reset.ejs
│   └── dashboard.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── scripts/
│   └── setup-db.js
└── docs/
    ├── API.md
    └── CHANGELOG.md
```

### Dependencies
Initialize package.json with:
```json
{
  "name": "legacy-auth-system",
  "version": "2.3.0",
  "description": "RetroTech Solutions Authentication System",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "setup-db": "node scripts/setup-db.js"
  },
  "dependencies": {
    "express": "4.17.1",
    "sqlite3": "5.0.2",
    "express-session": "1.17.1",
    "session-file-store": "1.5.0",
    "body-parser": "1.19.0",
    "ejs": "3.1.6"
  }
}
```

### Core Implementation Requirements

#### 1. Main Application (app.js)
- Express server on port 3000
- EJS templating
- Session management with file store
- Body parser for form data
- Static file serving
- Route mounting for /auth, /reset, and /api/debug

#### 2. Database Schema (SQLite)
Create users table with:
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password_hash (TEXT)
- email (TEXT)
- created_at (DATETIME)
- reset_token (TEXT)
- reset_token_expires (DATETIME)

#### 3. Authentication Utils (utils/auth.js)
Implement these VULNERABLE functions:
```javascript
// VULNERABILITY 1: Use MD5 for hashing
function hashPassword(password, username) {
    const crypto = require('crypto');
    // VULNERABILITY 2: Use username as salt (predictable)
    return crypto.createHash('md5').update(username + password).digest('hex');
}

// VULNERABILITY 3: Timing attack vulnerable comparison
function verifyPassword(inputPassword, username, storedHash) {
    const inputHash = hashPassword(inputPassword, username);
    return inputHash === storedHash; // Direct comparison - timing attack possible
}
```

#### 4. Password Reset (utils/reset.js)
Implement VULNERABLE reset token:
```javascript
// VULNERABILITY 4: Weak reset token generation
function generateResetToken(username) {
    const crypto = require('crypto');
    // Round timestamp to hour for predictability
    const hourTimestamp = Math.floor(Date.now() / 3600000) * 3600000;
    return crypto.createHash('md5').update(username + hourTimestamp).digest('hex');
}
```

#### 5. Routes Implementation

**auth.js routes:**
- POST /register - Create new user with MD5 hashed password
- POST /login - Authenticate user (vulnerable to timing attacks)
- GET /logout - Destroy session
- GET /dashboard - Protected route showing user info

**reset.js routes:**
- GET /reset-password - Show reset form
- POST /reset-password - Generate weak reset token
- GET /reset-password/:token - Verify token and show new password form
- POST /reset-password/:token - Update password

**debug.js routes:**
```javascript
// VULNERABILITY 5: Exposed debug endpoint
router.get('/api/debug/users', (req, res) => {
    // Add comment: "TODO: Remove before production"
    // This endpoint exposes all user hashes
    db.all('SELECT * FROM users', (err, users) => {
        res.json({ users, debug: true, version: '2.3.0' });
    });
});
```

#### 6. Views (EJS Templates)

**login.ejs:**
- Basic login form
- Include HTML comment: `<!-- Debug endpoint still active at /api/debug/users - REMOVE BEFORE PRODUCTION -->`
- Link to Bootstrap 3.3.7 (outdated) and jQuery 1.12.4

**register.ejs:**
- Registration form with username, email, password
- Client-side validation (easily bypassed)

**reset.ejs:**
- Password reset request form
- New password form for token validation

**dashboard.ejs:**
- Show logged-in user info
- Logout button
- Display "Welcome to RetroTech Solutions Secure Portal"

#### 7. Environment Configuration (.env.example)
```
# Default configuration - CHANGE IN PRODUCTION!
PEPPER_VALUE=RetroTech2010
SESSION_SECRET=keyboard_cat
DEBUG_MODE=true
DB_PATH=./database/users.db
```

#### 8. Database Setup Script (scripts/setup-db.js)
Create script that:
1. Creates users table
2. Inserts 15 sample users with these credentials:

| Username | Password | Email |
|----------|----------|-------|
| admin | admin123 | admin@retrotech.com |
| john.doe | Password1 | john@example.com |
| jane.smith | qwerty123 | jane@example.com |
| test.user | test123 | test@example.com |
| demo | demo | demo@example.com |
| alice | alice2024 | alice@example.com |
| bob | bobsecure | bob@example.com |
| charlie | charlie123 | charlie@example.com |
| david | david456 | david@example.com |
| eve | evepassword | eve@example.com |
| frank | frank789 | frank@example.com |
| grace | grace321 | grace@example.com |
| henry | henry654 | henry@example.com |
| iris | iris987 | iris@example.com |
| jack | jack111 | jack@example.com |

3. Creates a backup file (users.db.backup) with the same data

#### 9. Public Assets

**public/css/style.css:**
- Basic styling with "corporate" blue theme
- RetroTech Solutions branding
- Outdated design patterns (gradients, shadows from 2010 era)

**public/js/main.js:**
- Basic form validation
- Include comment: `// Legacy code - do not modify without approval`

#### 10. Documentation

**docs/API.md:**
```markdown
# RetroTech Solutions API Documentation

## Authentication Endpoints

### POST /register
Register a new user account.

### POST /login
Authenticate user credentials.

### POST /reset-password
Request a password reset token.

## System Information
Version: 2.3.0
Last Updated: 2010 (with minor patches)
```

**docs/CHANGELOG.md:**
```markdown
# Changelog

## v2.3.0 - 2024
- Minor bug fixes
- Performance improvements

## v2.2.0 - 2020
- Added password reset functionality

## v2.0.0 - 2015
- Migrated to Node.js

## v1.0.0 - 2010
- Initial release
- MD5 hashing implementation
- Note: Planning to upgrade to bcrypt in next major version
```

### Important Implementation Notes

1. **Make it look real**: Add proper error handling, logging, and professional-looking UI
2. **Hidden vulnerabilities**: Don't make vulnerabilities obvious in variable names or comments (except for the intentional hints)
3. **Consistency**: Use consistent coding style throughout
4. **Functionality**: Everything should actually work - users can register, login, reset passwords
5. **Security theater**: Add messages like "Your connection is secure" or "Protected by RetroTech Security" to make it ironically authentic

### Testing Checklist
After implementation, verify:
- [ ] Users can register with MD5 hashed passwords
- [ ] Login works with timing attack vulnerability
- [ ] Debug endpoint exposes all user hashes
- [ ] Password reset generates predictable tokens
- [ ] Database backup file is accessible
- [ ] HTML comment hint is visible in page source
- [ ] All 15 sample users are created

### Final Notes
This system is intentionally vulnerable for educational purposes. It demonstrates common security mistakes found in legacy systems. The goal is to create a realistic-looking authentication system that other students can practice security testing on. Make sure the vulnerabilities are functional but not immediately obvious without investigation.