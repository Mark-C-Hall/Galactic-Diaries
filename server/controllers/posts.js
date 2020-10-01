const Post = require('../models/Post');
const asyncHandler = require('../middleware/async');

// @desc        Get all posts
// @route       GET /api/posts
// @route       GET /api/users/:userId/posts
exports.getPosts = asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query };

    // Fields to exclude from query
    const removedFields = ['select', 'sort', 'page', 'limit'];

    // Loop over exclude Fields and remove from query
    removedFields.forEach((field) => delete reqQuery[field]);

    // Find resource
    let query;
    if (req.params.userId) {
        query = Post.find({ author: req.params.userId });
    } else {
        query = Post.find(reqQuery).populate({
            path: 'author',
            select: 'name bio',
        });
    }

    // Select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query.sort(sortBy);
    } else {
        query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10 || 1);
    const limit = parseInt(req.query.limit, 10 || 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments();

    query.skip(startIndex).limit(limit);

    // Execute query
    const posts = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.status(200).json({
        success: true,
        count: posts.length,
        pagination,
        data: posts,
    });
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
// TODO create exception for posts without users
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
