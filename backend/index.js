const express = require('express');
const passport = require('passport');
const session = require('express-session');
const {addBook, updateBook, deleteBook} = require("./controllers/bookController");
require('dotenv').config()
require('./config/passport');
const dbConnect = require("./config/db");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

dbConnect();




app.use('/api/v1/auth', require('./routes/userRoutes'));
app.post("/addbook", addBook);
app.put("/updatebook/:id", updateBook);
app.delete("/deletebook/:id", deleteBook);

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/api/v1/auth/failure',
        successRedirect: '/api/v1/auth/protected'
    })
);

app.get('/', (req, res) => {
    let link = '/api/v1/auth/google';
    res.send(`Click Here: <a href="${link}">OAuth</a>`);
});


app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});