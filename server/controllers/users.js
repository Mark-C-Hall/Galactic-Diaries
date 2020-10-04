const path = require('path');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get all users
// @route       GET /api/users
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().populate('posts');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});

// @desc        Get a single user
// @route       GET /api/users/:id
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User not found at id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Create a user
// @route       POST /api/users
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user,
    });
});

// @desc        Update a user
// @route       PUT /api/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(
            new ErrorResponse(`User not found at id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: user });
});

// @desc        Delete a user
// @route       DELETE /api/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User not found at id ${req.params.id}`, 404)
        );
    }

    user.remove();

    res.status(200).json({ success: true });
});

// @desc        Upload a photo
// @route       PUT /api/users/:id/photo
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(400).json({ success: false });
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload a file.', 400));
    }

    const file = req.files.file;

    // Check if file is photo
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

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse('Problem with file upload', 500));
        }
        await User.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            sucess: true,
            data: file.name,
        });
    });
});
