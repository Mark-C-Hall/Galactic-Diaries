/*
 * Controller Methods for Logging in users, providing user tokens, and
 * performing CRUD functionality for Users who are logged in.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const crypto = require('crypto');
const path = require('path');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc        Register User
// @route       POST /api/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    // Select fields to add to db.
    const { name, email, password, role, _id } = req.body;

    // Create user
    const user = await User.create({ name, email, password, role, _id });

    // Send response
    sendTokenResponse(user, 200, res);
});

// @desc        Login User
// @route       POST /api/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
    // Select fields
    const { email, password } = req.body;

    // Validate Email and Password
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email or password', 400)
        );
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Send response
    sendTokenResponse(user, 200, res);
});

// @desc        Get current logged in user
// @route       GET /api/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // Find user by token
    const user = await User.findById(req.user._id);

    res.status(200).json({ success: true, data: user });
});

// @desc        Update logged in user details
// @route       Put /api/auth/me
// @access      Private
exports.updateMe = asyncHandler(async (req, res, next) => {
    // Selecting partial fields
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
    };

    // Remove undefined fields
    if (req.body.name == undefined) {
        delete fieldsToUpdate.name;
    }
    if (req.body.email == undefined) {
        delete fieldsToUpdate.email;
    }
    if (req.body.bio == undefined) {
        delete fieldsToUpdate.bio;
    }

    // Updating user with fields
    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    // Send response
    res.status(200).json({ success: true, data: user });
});

// @desc        Deletes logged in user from db
// @route       DELETE /api/auth/me
// @access      Private
exports.deleteMe = asyncHandler(async (req, res, next) => {
    // Find user
    const user = await User.findById(req.user._id);

    // Delete User
    user.remove();

    // Send response
    res.status(200).json({ success: true });
});

// @desc        Upload current logged in user's photo
// @route       PUT /api/auth/uploadPhoto
// @access      Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

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

// @desc        Update password
// @route       PUT /api/auth/updatepassword
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // Find user and grab password
    const user = await User.findById(req.user._id).select('+password');

    // Throw error if password doesn't match
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    // Set new password
    user.password = req.body.newPassword;
    await user.save();

    // Send response
    sendTokenResponse(user, 200, res);
});

// @desc        Forgot Password
// @route       POST /api/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // If not email
    if (!user) {
        return next(
            new ErrorResponse(
                `User not found with email ${req.body.email}`,
                404
            )
        );
    }

    // Get reset token and save to db.
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/auth/resetPassword/${resetToken}`;

    // Email message
    const message = `You are receiving this email because you have requested the reset of a password. Please place a PUT request to \n\n ${resetUrl}`;

    // Sends Message
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message: message,
        });

        // Send response
        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        // If error, remove fields from db and throw error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc        Reset Password
// @route       PUT /api/auth/resetpassword/:resettoken
// @access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    // Find user based on Reset Token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    // Thorow error if not user.
    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    // Set new password.
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send response
    sendTokenResponse(user, 200, res);
});

// Get token from Model. Create cookie and send response.
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Set token options
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // HTTPS cookie if in production
    if (process.env.NODE_ENV == 'production') {
        options.secure = true;
    }

    // Send response
    res.status(statusCode)
        .cookie('token', token, options)
        .json({ sucess: true, token });
};
