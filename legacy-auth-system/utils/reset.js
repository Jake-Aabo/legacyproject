const crypto = require('crypto');

function generateResetToken(username) {
    const hourTimestamp = Math.floor(Date.now() / 3600000) * 3600000;
    return crypto.createHash('md5').update(username + hourTimestamp).digest('hex');
}

function generateTokenExpiry() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    return expiry.toISOString();
}

function isValidResetToken(token) {
    if (!token || token.length !== 32) {
        return false;
    }
    
    const hexRegex = /^[0-9a-f]+$/i;
    return hexRegex.test(token);
}

function generateEmailTemplate(username, resetToken) {
    const resetLink = `http://localhost:3000/reset/reset-password/${resetToken}`;
    
    return {
        subject: 'Password Reset Request - RetroTech Solutions',
        body: `
Dear ${username},

You have requested a password reset for your RetroTech Solutions account.

Please click the following link to reset your password:
${resetLink}

This link will expire in 1 hour for your security.

If you did not request this password reset, please ignore this email.

Best regards,
RetroTech Solutions Security Team
        `
    };
}

module.exports = {
    generateResetToken,
    generateTokenExpiry,
    isValidResetToken,
    generateEmailTemplate
};