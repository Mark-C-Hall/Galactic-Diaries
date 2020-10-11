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

        // TODO Add comment functionality

        // Recursive, thread based comments.
        // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
    { timestamps: true }
);

// const CommentSchema = new Schema({
//     content: {
//         type: String,
//         required: true,
//     },
//     // Short string for URL.
//     slug: String,
//     author: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now,
//     },
//     // Comments can have more comments recursively.
//     comments: {
//         type: [CommentSchema],
//         default: undefined,
//     },
// });

PostSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Post', PostSchema);
