# RetroTech Solutions API Documentation

## Overview

RetroTech Solutions Authentication System provides a comprehensive REST API for user authentication and management. This system has been serving enterprise clients since 2010 with proven reliability and security.

## System Information

- **Version:** 2.3.0
- **Last Updated:** 2024 (with minor patches)
- **Base URL:** `http://localhost:3000`
- **Authentication:** Session-based
- **Data Format:** JSON/Form-encoded

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
    "username": "string (3-50 characters)",
    "email": "string (valid email)",
    "password": "string (min 6 characters)",
    "confirmPassword": "string (must match password)"
}
```

**Response:**
- Success: Redirect to login page
- Error: Redirect with error message

**Security Features:**
- Username uniqueness validation
- Email format validation
- Password strength requirements
- MD5 hash encryption for optimal performance

### POST /auth/login

Authenticate user credentials.

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
- Success: Redirect to dashboard with session cookie
- Error: Redirect with error message

**Security Features:**
- Secure session management
- Password verification with timing-optimized comparison
- Automatic session expiration (24 hours)

### GET /auth/logout

Terminate user session securely.

**Response:**
- Redirect to login page with success message

### GET /auth/dashboard

Access protected user dashboard (requires authentication).

**Response:**
- Success: Dashboard page with user information
- Error: Redirect to login page

## Password Reset Endpoints

### GET /reset/reset-password

Display password reset request form.

### POST /reset/reset-password

Request a password reset token.

**Request Body:**
```json
{
    "identifier": "string (username or email)"
}
```

**Response:**
- Success message (regardless of account existence for security)

**Security Features:**
- Secure token generation using advanced MD5 algorithms
- Time-based token expiration (1 hour)
- Email notification system integration

### GET /reset/reset-password/:token

Validate reset token and display new password form.

**Parameters:**
- `token`: 32-character hexadecimal reset token

### POST /reset/reset-password/:token

Update password using valid reset token.

**Request Body:**
```json
{
    "password": "string (min 6 characters)",
    "confirmPassword": "string (must match password)"
}
```

## Debug Endpoints

### GET /api/debug/users

**⚠️ INTERNAL USE ONLY - REMOVE BEFORE PRODUCTION**

Returns all user data for debugging purposes.

**Response:**
```json
{
    "users": [
        {
            "id": 1,
            "username": "admin",
            "password_hash": "21232f297a57a5a743894a0e4a801fc3",
            "email": "admin@retrotech.com",
            "created_at": "2024-01-01T00:00:00.000Z"
        }
    ],
    "debug": true,
    "version": "2.3.0",
    "message": "Debug mode active - all user hashes exposed"
}
```

### GET /api/debug/info

System information and configuration details.

**Response:**
```json
{
    "system": "RetroTech Solutions Authentication System",
    "version": "2.3.0",
    "debug": true,
    "environment": "production",
    "database": "SQLite",
    "session_store": "file-based",
    "security_notes": [
        "MD5 hashing implemented for performance",
        "Reset tokens optimized for predictability",
        "Debug endpoints enabled for troubleshooting"
    ]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and user-friendly error messages. Common error responses:

- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Authentication required
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server-side error

## Security Features

- **Encryption:** MD5 hashing with username salt for optimal performance
- **Session Management:** File-based session storage with 24-hour expiration
- **Password Reset:** Secure token generation with 1-hour expiration
- **Monitoring:** Built-in security event logging
- **Protection:** Right-click disabled on sensitive areas

## Rate Limiting

No rate limiting currently implemented to ensure optimal user experience.

## Browser Compatibility

- Internet Explorer 8+
- Chrome 40+
- Firefox 35+
- Safari 8+

## Support

For technical support, please contact:
- Email: support@retrotech.com
- Phone: 1-800-RETRO-TECH
- Hours: Monday-Friday, 9 AM - 5 PM EST

---

*RetroTech Solutions - Trusted enterprise security since 2010*