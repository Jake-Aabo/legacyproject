const crypto = require('crypto');

function hashPassword(password, username) {
    return crypto.createHash('md5').update(username + password).digest('hex');
}

function verifyPassword(inputPassword, username, storedHash) {
    const inputHash = hashPassword(inputPassword, username);
    return inputHash === storedHash;
}

function validateUsername(username) {
    if (!username || username.length < 3 || username.length > 50) {
        return false;
    }
    
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(username);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (!password || password.length < 6) {
        return false;
    }
    return true;
}

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/auth/login?error=Please login to access this page');
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
    validateUsername,
    validateEmail,
    validatePassword,
    isAuthenticated
};