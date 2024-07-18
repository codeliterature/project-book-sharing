const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    // coverImage : {
    //     type: String
    // },
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
    // ISBN: {
    //     type: String
    // },
    // publisher: {
    //     type: String
    // },
    // publicationDate: {
    //     type: Date
    // },
    // genre: {
    //     type: String
    // },
    // language : {
    //     type: String
    // },
    // pages : {
    //     type: Number
    // },
    // format : {
    //     type: String
    //     // eg. Hardcover, Paperback, ebook
    // },
    // edition : {
    //     type: String
    // },
    // condition : {
    //     type: String,
    //     enum: ["New", "Like New", "Very Good", "Good", "Acceptable", "Poor"],
    // },
    // owner : {
    //     type : Schema.Types.ObjectId,
    //     ref : 'User',
    // },
    // reviews : [{
    //     type : Schema.Types.ObjectId,
    //     ref: 'Review'
    // }],
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