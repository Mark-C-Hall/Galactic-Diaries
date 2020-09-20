const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

    // TODO Add comment functionality

    // Recursive, thread based comments.
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

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

module.exports = mongoose.model('Post', PostSchema);