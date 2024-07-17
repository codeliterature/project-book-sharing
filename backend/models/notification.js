const mongoose = require('mongoose');
const Schema = mongoose.schema;

const notificationSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    message: {
        type: String,
        default: "is intrested in your book"
    },
    timestamp: {
        type: Date,
        default : Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Review', notificationSchema);