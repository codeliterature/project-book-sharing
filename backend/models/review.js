const mongoose = require('mongoose');
const { Schema } = mongoose;
// Define the review schema
const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 800 // Maximum length for comments
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Review model
module.exports = mongoose.model('Review', reviewSchema);















// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userReviewSchema = new Schema({
//     reviewer: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     reviewedUser: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//         required: true
//     },
//     comment: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default : Date.now
//     }
// });

// module.exports = mongoose.model('Review', userReviewSchema);