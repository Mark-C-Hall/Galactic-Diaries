/*
 * Mongoose model for Users.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Schema(
    {
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
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        bio: {
            type: String,
            required: false,
        },
        // Users can only modify their posts and their posts' comments.
        // Admins can modify all posts and comments.
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        photo: {
            type: String,
            default: 'no-photo.png',
        },
    },
    // DB manipulation to allow for virtual populations.
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database.
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade Delete Posts when a User is deleted
UserSchema.pre('remove', async function (next) {
    console.log(`Posts being removed: ${this._id}`);
    await this.model('Post').deleteMany({ author: this._id });
    next();
});

// Reverse populate with schema
UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    justOne: false,
});

UserSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'author',
    justOne: false,
});

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash password and set to resetTokenPassword field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set resetPassword expire to 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
