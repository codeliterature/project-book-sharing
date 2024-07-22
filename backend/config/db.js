const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConnect = async () => {
    try {
        const dbUri = process.env.DB_URI;
        if (!dbUri) {
            throw new Error('Database URI is not defined in .env file');
        }
        await mongoose.connect(dbUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = dbConnect;