/*
 * Route handling for {{URL}}/api/auth/
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateMe,
    updatePassword,
    uploadPhoto,
    deleteMe,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router
    .route('/me')
    .get(protect, getMe)
    .put(protect, updateMe)
    .delete(protect, deleteMe);
router.route('/uploadphoto').put(protect, uploadPhoto);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;
