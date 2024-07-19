const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    profilePicture : {
        type: String
    },
    bio: {
        type: String
    },
    birthday: {
        type: Date
    },
    gender: {
        type: String
    },
    location: {
        type: String
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'UserReview'
    }],
    rating: {
        type: Number
    },
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
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

module.exports = mongoose.model('User', userSchema);