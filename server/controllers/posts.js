/*
 * Controller Methods for Posts' CRUD functionality
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const Post = require('../models/Post');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get all posts
// @route       GET /api/posts
// @route       GET /api/users/:userId/posts
// @access      Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    // Check if coming from user's route.
    if (req.params.userId) {
        // Find posts by user
        const posts = await Post.find({ author: req.params.userId });

        // Send Response
        return res
            .status(200)
            .json({ sucess: true, count: posts.length, data: posts });
    } else {
        // Send response w/ Advance query functionality
        res.status(200).json(res.advancedResults);
    }
});

// @desc        Get a single post
// @route       GET /api/posts/:id
// @access      Public
exports.getPost = asyncHandler(async (req, res, next) => {
    // Find post
    const post = await Post.findById(req.params.id).populate({
        path: 'author',
        select: 'name bio',
    });

    // Throw error if not post
    if (!post) {
        return next(
            new ErrorResponse(`Post not found at id ${req.params.id}`, 404)
        );
    }

    // Send response
    res.status(200).json({
        success: true,
        data: post,
    });
});

// @desc        Create a post
// @route       POST /api/posts
// @access      Private
exports.createPost = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.author = req.user._id;

    // Create new post
    const post = await Post.create(req.body);

    // Send response
    res.status(201).json({
        success: true,
        data: post,
    });
});

// @desc        Update a post
// @route       Put /api/posts/:id
// @access      Private
exports.updatePost = asyncHandler(async (req, res, next) => {
    // Find post
    let post = await Post.findById(req.params.id);

    // Throw error if not post
    if (!post) {
        return next(
            new ErrorResponse(`Post not found at id ${req.params.id}`, 404)
        );
    }

    // Check if not owner of post or no
    if (post.author.toString() != req.user._id && req.user.role != 'admin') {
        return next(
            new ErrorResponse(`User ${req.user._id} is not authorized`, 401)
        );
    }

    // Update post
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // Send response
    res.status(200).json({ success: true, data: post });
});

// @desc        Delete a post
// @route       GET /api/posts:/id
// @access      Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    // Find post
    let post = await Post.findById(req.params.id);

    // Throw error if not post
    if (!post) {
        return next(
            new ErrorResponse(`Post not found at id ${req.params.id}`, 404)
        );
    }

    // Check if not owner of post or no
    if (post.author.toString() != req.user._id && req.user.role != 'admin') {
        return next(
            new ErrorResponse(`User ${req.user._id} is not authorized`, 401)
        );
    }

    // Find post and delete
    post = await Post.findByIdAndDelete(req.params.id);

    // Send response
    res.status(200).json({ success: true });
});
