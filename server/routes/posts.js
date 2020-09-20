const express = require('express');
const router = express.Router();

const {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/posts');

router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPost).put(updatePost).delete(deletePost);

module.exports = router;
