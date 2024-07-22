const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('./config/passport')
const dbConnect = require("./config/db");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 30 * 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
dbConnect();

// Routes
app.use('/api/v1/auth', require('./routes/userRoutes'));
app.use('/api/v1/books', require('./routes/bookRoutes'));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/v1/auth/failure',
        successRedirect: '/api/v1/auth/protected'
    })
);

// Main Route
app.get('/', (req, res) => {
    let link = '/api/v1/auth/google';
    res.send(`Click Here: <a href="${link}">OAuth</a>`);
});

app.get('/home', (req, res) => {
    res.send('Welcome to the API. Visit /api/v1/auth for authentication or /api/v1/books for book-related operations.');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});