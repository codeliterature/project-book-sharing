const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the Book model
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: [String],
        required: true,
        enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Mystery', 'Romance'] // Add or modify genres as needed
    },
    publicationYear: {
        type: Number,
        required: true,
        min: [1000, 'Publication year must be at least 1000'], // Ensures valid publication year
        max: [new Date().getFullYear(), 'Publication year cannot be in the future'] // Ensures publication year is not in the future
    },
    ISBN: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(97(8|9))?\d{9}(\d|X)$/.test(v); // Basic validation for ISBN-10 or ISBN-13
            },
            message: props => `${props.value} is not a valid ISBN!`
        }
    },
    coverImage: {
        type: [String],
    },
    description: {
        type: String,
        trim: true
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Used', 'Worn'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create and export the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;