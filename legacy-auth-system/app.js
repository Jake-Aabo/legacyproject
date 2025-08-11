const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const resetRoutes = require('./routes/reset');
const debugRoutes = require('./routes/debug');

const app = express();
const PORT = 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
    store: new FileStore({
        path: './sessions',
        logFn: function() {}
    }),
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/reset', resetRoutes);
app.use('/api/debug', debugRoutes);

// Default route
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/auth/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Internal Server Error - RetroTech Solutions');
});

// Start server
app.listen(PORT, () => {
    console.log(`RetroTech Solutions Authentication System v2.3.0`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Your connection is secure - Protected by RetroTech Security`);
});

module.exports = app;