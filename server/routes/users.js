const express = require('express');

const {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    userPhotoUpload,
} = require('../controllers/users');

// include other resources
const postRouter = require('./posts');

const router = express.Router();

// Reroute into other resource
router.use('/:userId/posts', postRouter);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/:id/photo').put(userPhotoUpload);

module.exports = router;
