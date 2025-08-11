const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { hashPassword, verifyPassword, validateUsername, validateEmail, validatePassword, isAuthenticated } = require('../utils/auth');

// Login page
router.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
});

// Register page
router.get('/register', (req, res) => {
    const error = req.query.error;
    res.render('register', { error });
});

// Dashboard page (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.session.user });
});

// Register POST
router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!validateUsername(username)) {
        return res.redirect('/auth/register?error=Invalid username. Must be 3-50 characters and contain only letters, numbers, dots, underscores, or hyphens.');
    }

    if (!validateEmail(email)) {
        return res.redirect('/auth/register?error=Invalid email format.');
    }

    if (!validatePassword(password)) {
        return res.redirect('/auth/register?error=Password must be at least 6 characters long.');
    }

    if (password !== confirmPassword) {
        return res.redirect('/auth/register?error=Passwords do not match.');
    }

    db.getUserByUsername(username, (err, existingUser) => {
        if (err) {
            console.error('Database error:', err);
            return res.redirect('/auth/register?error=Registration failed. Please try again.');
        }

        if (existingUser) {
            return res.redirect('/auth/register?error=Username already exists.');
        }

        db.getUserByEmail(email, (err, existingEmail) => {
            if (err) {
                console.error('Database error:', err);
                return res.redirect('/auth/register?error=Registration failed. Please try again.');
            }

            if (existingEmail) {
                return res.redirect('/auth/register?error=Email already registered.');
            }

            const passwordHash = hashPassword(password, username);
            
            db.createUser(username, passwordHash, email, (err, userId) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.redirect('/auth/register?error=Registration failed. Please try again.');
                }

                console.log(`New user registered: ${username} (ID: ${userId})`);
                res.redirect('/auth/login?success=Registration successful. Please login.');
            });
        });
    });
});

// Login POST
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/auth/login?error=Please provide both username and password.');
    }

    db.getUserByUsername(username, (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.redirect('/auth/login?error=Login failed. Please try again.');
        }

        if (!user) {
            return res.redirect('/auth/login?error=Invalid username or password.');
        }

        if (verifyPassword(password, username, user.password_hash)) {
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at
            };
            
            console.log(`User logged in: ${username}`);
            res.redirect('/auth/dashboard');
        } else {
            return res.redirect('/auth/login?error=Invalid username or password.');
        }
    });
});

// Logout
router.get('/logout', (req, res) => {
    const username = req.session.user ? req.session.user.username : 'Unknown';
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        } else {
            console.log(`User logged out: ${username}`);
        }
        res.redirect('/auth/login?success=You have been logged out successfully.');
    });
});

module.exports = router;