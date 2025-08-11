const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { hashPassword, validatePassword } = require('../utils/auth');
const { generateResetToken, generateTokenExpiry, isValidResetToken, generateEmailTemplate } = require('../utils/reset');

// Password reset request page
router.get('/reset-password', (req, res) => {
    const error = req.query.error;
    const success = req.query.success;
    res.render('reset', { 
        error, 
        success, 
        step: 'request',
        token: null 
    });
});

// Password reset request POST
router.post('/reset-password', (req, res) => {
    const { identifier } = req.body;

    if (!identifier) {
        return res.redirect('/reset/reset-password?error=Please provide a username or email.');
    }

    const isEmail = identifier.includes('@');
    const searchMethod = isEmail ? 'getUserByEmail' : 'getUserByUsername';

    db[searchMethod](identifier, (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.redirect('/reset/reset-password?error=Reset request failed. Please try again.');
        }

        if (!user) {
            return res.redirect('/reset/reset-password?success=If the account exists, a reset link has been sent.');
        }

        const resetToken = generateResetToken(user.username);
        const tokenExpiry = generateTokenExpiry();

        db.setResetToken(user.username, resetToken, tokenExpiry, (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.redirect('/reset/reset-password?error=Reset request failed. Please try again.');
            }

            const emailTemplate = generateEmailTemplate(user.username, resetToken);
            
            console.log('Password reset requested for:', user.username);
            console.log('Reset token generated:', resetToken);
            console.log('Reset link:', `http://localhost:3000/reset/reset-password/${resetToken}`);
            console.log('Email would be sent to:', user.email);
            console.log('Email content:', emailTemplate.body);

            res.redirect('/reset/reset-password?success=If the account exists, a reset link has been sent.');
        });
    });
});

// Password reset form with token
router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    const error = req.query.error;

    if (!isValidResetToken(token)) {
        return res.redirect('/reset/reset-password?error=Invalid reset link.');
    }

    db.getUserByResetToken(token, (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.redirect('/reset/reset-password?error=Reset link verification failed.');
        }

        if (!user) {
            return res.redirect('/reset/reset-password?error=Invalid or expired reset link.');
        }

        res.render('reset', { 
            error, 
            success: null, 
            step: 'reset',
            token: token,
            username: user.username 
        });
    });
});

// Password reset POST with token
router.post('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    if (!isValidResetToken(token)) {
        return res.redirect('/reset/reset-password?error=Invalid reset link.');
    }

    if (!validatePassword(password)) {
        return res.redirect(`/reset/reset-password/${token}?error=Password must be at least 6 characters long.`);
    }

    if (password !== confirmPassword) {
        return res.redirect(`/reset/reset-password/${token}?error=Passwords do not match.`);
    }

    db.getUserByResetToken(token, (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.redirect('/reset/reset-password?error=Password reset failed. Please try again.');
        }

        if (!user) {
            return res.redirect('/reset/reset-password?error=Invalid or expired reset link.');
        }

        const newPasswordHash = hashPassword(password, user.username);

        db.updateUserPassword(user.username, newPasswordHash, (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.redirect(`/reset/reset-password/${token}?error=Password reset failed. Please try again.`);
            }

            db.clearResetToken(user.username, (err) => {
                if (err) {
                    console.error('Error clearing reset token:', err);
                }

                console.log(`Password reset successful for user: ${user.username}`);
                res.redirect('/auth/login?success=Password reset successful. Please login with your new password.');
            });
        });
    });
});

module.exports = router;