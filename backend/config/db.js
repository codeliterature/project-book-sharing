const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConnect = () => {
    mongoose.connect(process.env.DB_URI).then(() => {
        console.log("DB Connection Successful.");
    })
    .catch((error) => {
        console.error(error);
    })
};

module.exports = dbConnect;