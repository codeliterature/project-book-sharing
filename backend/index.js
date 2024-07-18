const { json } = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const {addBook, updateBook, deleteBook} = require("./controllers/bookController");
require('dotenv').config()




const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("connected successfully");
});


app.use('/api/v1/auth', require('./routes/userRoutes'));
app.post("/addbook", addBook);
app.put("/updatebook/:id", updateBook);
app.delete("/deletebook/:id", deleteBook);


app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});