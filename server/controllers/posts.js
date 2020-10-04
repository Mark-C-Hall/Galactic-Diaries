const Post = require('../models/Post');
const asyncHandler = require('../middleware/async');

// @desc        Get all posts
// @route       GET /api/posts
// @route       GET /api/users/:userId/posts
exports.getPosts = asyncHandler(async (req, res, next) => {
    if (req.params.userId) {
        const posts = await Post.find({ author: req.params.userId });

        return res
            .status(200)
            .json({ sucess: true, count: posts.length, data: posts });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc        Get a single post
// @route       GET /api/posts/:id
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'author',
        select: 'name bio',
    });

    if (!post) {
        return res.status(400).json({ success: false });
    }

    res.status(200).json({
        success: true,
        data: post,
    });
});

// @desc        Create a post
// @route       POST /api/posts
exports.createPost = asyncHandler(async (req, res, next) => {
    const post = await Post.create(req.body);

    res.status(201).json({
        success: true,
        data: post,
    });
});

// @desc        Update a post
// @route       Put /api/posts/:id
exports.updatePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!post) {
        return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: post });
});

// @desc        Delete a post
// @route       GET /api/posts:/id
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
        res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true });
});
