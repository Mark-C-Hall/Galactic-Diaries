/*
 * Mongoose model to hold Posts and comments.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

// Define comment scheme first
const CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Comments can have more comments recursively.
CommentSchema.add({
    comments: [CommentSchema],
});

// Lay out Post scheme w/ comments
const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        // Creates a short string for URL
        slug: String,
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['draft', 'published', 'private'],
            default: 'draft',
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        comments: [CommentSchema],
    },
    { timestamps: true }
);

// Method for generating Post slug for frontend URL's
PostSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Post', PostSchema);
