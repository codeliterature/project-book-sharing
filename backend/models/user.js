const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 8
    },
    googleId: {
        type: String
    },
    rating: {
        type: Number,
        max: 5
    },
    bio: {
        type: String,
        maxlength: 500
    },
    profilePicture: {
        type: String,
    },
    birthday: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer not to say']
    },
    location: {
        type: String,
        maxlength: 100 
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
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
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);















// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     username : {
//         type: String,
//         required: true,
//         unique: true
//     },
//     email : {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String
//     },
//     googleId: {
//         type: String
//     },
//     profilePicture : {
//         type: String
//     },
//     bio: {
//         type: String
//     },
//     birthday: {
//         type: Date
//     },
//     gender: {
//         type: String
//     },
//     location: {
//         type: String
//     },
//     rating: {
//         type: Number
//     },
//     followers: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     following: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     books: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Book'
//     }],
//     reviews: [{
//         type: Schema.Types.ObjectId,
//         ref: 'UserReview'
//     }],
//     notifications: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Notification'
//     }],
//     createdAt: {
//         type: Date,
//         default : Date.now
//     },
//     updatedAt: {
//         type : Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('User', userSchema);