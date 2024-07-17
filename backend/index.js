const { json } = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = "MynameisBook";
const {addBook, updateBook, deleteBook} = require("./controllers/bookController");
require('dotenv').config()



const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI).then(()=> {
    console.log("connected successfully");
});


app.get("/api", (req, res) => {
    res.send("Hello world");
});

const login = async (req, res) => {
    const {email, password} = req.body
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const user = await userSchema.findOne({email});
    if(!user){
        res.sendStatus("User doesn't exist");
    }
    if (bcrypt.compareSync(password, hash)){
        console.log(user);
        res.sendStatus(200)
    }
    
}

const signup = (req, res) => {
    const {email, password, username} = req.body
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const new_user = new userSchema({
        username: username,
        email: email,
        password: hash
    });

    new_user.save()
    res.sendStatus("successfull")
}

app.post("/login", login);
app.post("/signup", signup);
app.post("/addbook", addBook);
app.put("/updatebook/:id", updateBook);
app.delete("/deletebook/:id", deleteBook);


app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});