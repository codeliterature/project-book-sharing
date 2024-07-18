const { json } = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();



const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("connected successfully");
});


app.use('/api/v1/auth', require('./routes/userRoutes'));


app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});