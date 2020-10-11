/*
 * Controller Methods for users' CRUD functionality. Must be admin to make
 * requests. Different from /auth/ because requests are made by user._id rather
 * than user token.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const path = require('path');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get all users
// @route       GET /api/users
// @access      Private, admins only
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Create a post
// @route       POST /api/users
// @access      Private, admins only
exports.createUser = asyncHandler(async (req, res, next) => {
    // Select specific fields
    const { name, email, password, role, _id } = req.body;

    // Create user
    const user = await User.create({ name, email, password, role, _id });

    // Send response
    res.status(201).json({
        success: true,
        data: user,
    });
});

// @desc        Get a single user
// @route       GET /api/users/:id
// @access      Private, admins only
exports.getUser = asyncHandler(async (req, res, next) => {
    // Find user
    const user = await User.findById(req.params.id);

    // Throw error if not user
    if (!user) {
        return next(
            new ErrorResponse(`User not found at id ${req.params.id}`, 404)
        );
    }

    // Send Response
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Update a user
// @route       PUT /api/users/:id
// @access      Private, admins only
exports.updateUser = asyncHandler(async (req, res, next) => {
    // Find and update user
    let user = await User.findById(req.params.id);

    // Throw error if not user
    if (!user) {
        return next(
            new ErrorResponse(`User not found at id ${req.params.id}`, 404)
        );
    }

    // Check if self or admin
    if (user._id != req.user._id && req.user.role != 'admin') {
        return next(
            new ErrorResponse(`User ${req.user._id} is not authorized`, 401)
        );
    }

    // Find and update user
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // Send response
    res.status(200).json({ success: true, data: user });
});

// @desc        Delete a user
// @route       DELETE /api/users/:id
// @access      Private, admins only
exports.deleteUser = asyncHandler(async (req, res, next) => {
    // Find user
    const user = await User.findById(req.params.id);

    // Throw error if not user
    if (!user) {
        return next(
            new ErrorResponse(`User not found at id ${req.params.id}`, 404)
        );
    }

    // Check if self or admin
    if (user._id != req.user._id && req.user.role != 'admin') {
        return next(
            new ErrorResponse(`User ${req.user._id} is not authorized`, 401)
        );
    }

    // Delete User
    user.remove();

    // Send response
    res.status(200).json({ success: true });
});

// @desc        Upload a photo
// @route       PUT /api/users/:id/photo
// @access      Private, admins only
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
    // Find user
    const user = await User.findById(req.params.id);

    // Throw error if not user
    if (!user) {
        res.status(400).json({ success: false });
    }

    // Check if self or admin
    if (user._id != req.user._id && req.user.role != 'admin') {
        return next(
            new ErrorResponse(`User ${req.user._id} is not authorized`, 401)
        );
    }

    // Throw error if no file
    if (!req.files) {
        return next(new ErrorResponse('Please upload a file.', 400));
    }

    // Check if file is photo
    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image file.', 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_SIZE) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_SIZE}`,
                400
            )
        );
    }

    // Create custom file name
    file.name = `photo_${user._id}${path.parse(file.name).ext}`;

    // Save file to server
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        // Throw error if error
        if (err) {
            console.error(err);
            return next(new ErrorResponse('Problem with file upload', 500));
        }
        // Update user with photo path in server
        await User.findByIdAndUpdate(req.params.id, { photo: file.name });

        // Send respone object.
        res.status(200).json({
            sucess: true,
            data: file.name,
        });
    });
});
