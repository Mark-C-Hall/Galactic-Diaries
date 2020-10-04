const express = require('express');
const router = express.Router({ mergeParams: true });
const Post = require('../models/Post');
const advancedResults = require('../middleware/advancedResults');

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
    .post(createPost);
router.route('/:id').get(getPost).put(updatePost).delete(deletePost);

module.exports = router;
