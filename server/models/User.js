const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // Full name.
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    // No encryption yet.
    password: {
        type: String,
        required: true,
        select: false,
    },
    // Short Description.
    bio: {
        type: String,
        required: false,
    },
    // Allowed to remove any post or comment.
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    photo: {
        type: String,
        default: 'no-photo.jpg',
    },
});

module.exports = mongoose.model('User', UserSchema);
