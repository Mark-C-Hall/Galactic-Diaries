const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get all users
// @route       GET /api/users
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();

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
// @route       Put /api/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: user });
});

// @desc        Delete a user
// @route       GET /api/users:/id
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true });
});
