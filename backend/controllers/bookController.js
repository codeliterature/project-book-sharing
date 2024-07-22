const Book = require('../models/book');
const mongoose = require('mongoose');
const userSchema = require('../models/user');

// Add a new book
const addBook = async (req, res) => {
    const { title, author, description, coverImage, isbn, condition, price, publicationYear, genre } = req.body;
    const userId = req.user.id;

    try {
        // Validate input
        if (!title || !author || !isbn) {
            return res.status(400).json({ message: 'Title, author, and ISBN are required' });
        }

        // Check if the user already added the same book
        const existingBook = await Book.findOne({ title, author, owner: userId });
        if (existingBook) {
            return res.status(400).json({ message: 'You have already added this book' });
        }

        // Create and save the book
        const newBook = new Book({
            title,
            author,
            description,
            coverImage,
            genre,
            publicationYear,
            condition,
            price,
            ISBN: isbn,
            owner: userId
        });

        await newBook.save();
        await userSchema.findByIdAndUpdate(userId, { $push: { books: newBook._id}});
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update book details
const updateBook = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    try {
        // Validate input
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        // Find the book and update it
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this book' });
        }

        Object.assign(book, updates);
        await book.save();
        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Validate input
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        // Find the book and delete it
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this book' });
        }

        const user = await userSchema.findById(userId);
        await Book.findByIdAndDelete(id);
        await user.updateOne({ $pull: { books: id } });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all books added by a specific user
const getUserBooks = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    try {
        // Retrieve books with pagination
        const books = await Book.find({ owner: userId })
                                .limit(limit * 1)
                                .skip((page - 1) * limit)
                                .exec();

        // Get total documents count for pagination
        const count = await Book.countDocuments({ owner: userId });

        res.status(200).json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all books with optional filters
const getAllBooks = async (req, res) => {
    const { title, author, isbn, page = 1, limit = 10 } = req.query;

    try {
        // Build query
        const query = {};
        if (title) query.title = new RegExp(title, 'i'); // Case-insensitive search
        if (author) query.author = new RegExp(author, 'i');
        if (isbn) query.isbn = isbn;

        // Retrieve books with pagination
        const books = await Book.find(query)
                                .limit(limit * 1)
                                .skip((page - 1) * limit)
                                .exec();

        // Get total documents count for pagination
        const count = await Book.countDocuments(query);

        res.status(200).json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { addBook, updateBook, deleteBook, getUserBooks, getAllBooks };
