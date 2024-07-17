const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    coverImage : {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    publisher: {
        type: String
    },
    publicationDate: {
        type: Date
    },
    genre: {
        type: [string]
    },
    language : {
        type: String
    },
    pages : {
        type: Number
    },
    format : {
        type: String
        // eg. Hardcover, Paperback, ebook
    },
    edition : {
        type: String
    },
    condition : {
        type: String,
        enum: ["New", "Like New", "Very Good", "Good", "Acceptable", "Poor"],
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref: 'Review'
    }],
    createdAt: {
        type: Date,
        default : Date.now
    },
    updatedAt: {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);