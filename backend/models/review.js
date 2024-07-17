const mongoose = require('mongoose');
const Schema = mongoose.schema;

const userReviewSchema = new Schema({
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
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Review', userReviewSchema);