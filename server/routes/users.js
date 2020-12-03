/*
 * Route handling for {{URL}}/api/users/
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const express = require('express');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

const {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    userPhotoUpload,
    createUser,
} = require('../controllers/users');

// include other resources
const postRouter = require('./posts');

const router = express.Router();

// Reroute into other resource
router.use('/:userId/posts', postRouter);

router
    .route('/')
    .get(protect, authorize('admin'), advancedResults(User, 'posts'), getUsers)
    .post(protect, authorize('admin'), createUser);
router
    .route('/:id')
    .get(protect, getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);
router.route('/:id/photo').put(protect, authorize('admin'), userPhotoUpload);

module.exports = router;
