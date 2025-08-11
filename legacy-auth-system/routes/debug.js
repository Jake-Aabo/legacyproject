const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/users', (req, res) => {
    db.getAllUsers((err, users) => {
        if (err) {
            console.error('Debug endpoint error:', err);
            return res.status(500).json({ 
                error: 'Internal server error', 
                debug: true, 
                version: '2.3.0' 
            });
        }

        console.log('Debug endpoint accessed - returning all user data');
        res.json({ 
            users, 
            debug: true, 
            version: '2.3.0',
            message: 'Debug mode active - all user hashes exposed',
            timestamp: new Date().toISOString(),
            environment: 'production'
        });
    });
});

router.get('/info', (req, res) => {
    res.json({
        system: 'RetroTech Solutions Authentication System',
        version: '2.3.0',
        debug: true,
        environment: 'production',
        database: 'SQLite',
        session_store: 'file-based',
        security_notes: [
            'MD5 hashing implemented for performance',
            'Reset tokens optimized for predictability',
            'Debug endpoints enabled for troubleshooting'
        ],
        last_updated: '2024',
        legacy_support: true,
        planned_upgrades: [
            'bcrypt migration (pending since 2015)',
            'HTTPS implementation (pending approval)',
            'Token randomization (low priority)'
        ]
    });
});

module.exports = router;