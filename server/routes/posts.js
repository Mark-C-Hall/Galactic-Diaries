/*
 * Route handling for {{URL}}/api/posts/
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const Post = require('../models/Post');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

const {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/posts');

router
    .route('/')
    .get(advancedResults(Post, 'author'), getPosts)
    .post(protect, createPost);
router
    .route('/:id')
    .get(getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);

module.exports = router;
