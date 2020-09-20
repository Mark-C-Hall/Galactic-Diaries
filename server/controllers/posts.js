const Post = require('../models/Post');

// @desc        Get all posts
// @route       GET /api/posts
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

// @desc        Get a single post
// @route       GET /api/posts/:id
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

// @desc        Create a post
// @route       POST /api/posts
exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);

        // TODO create exception for posts without users

        res.status(201).json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
    }
};

// @desc        Update a post
// @route       Put /api/posts/:id
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!post) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {}
};

// @desc        Delete a post
// @route       GET /api/posts:/id
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};
