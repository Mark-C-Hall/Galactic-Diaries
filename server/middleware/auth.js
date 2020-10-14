/*
 * Middleware methods for authenticating users on specific routes and roles.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Log in using bearer token
        token = req.headers.authorization.split(' ')[1];
    }
    // Log in using cookie
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // Check if token exists
    if (!token) {
        return next(
            new ErrorResponse('Not authorized to access this resource', 401)
        );
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        // Throw error if token cannot find user
        if (!user) {
            return next(new ErrorResponse('Invalid Token', 401));
        }

        req.user = user;

        next();
    } catch (error) {
        return next(
            new ErrorResponse('Not authorized to access this resource', 401)
        );
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role '${req.user.role}' is unauthorize to access this route`,
                    403
                )
            );
        }
        next();
    };
};
